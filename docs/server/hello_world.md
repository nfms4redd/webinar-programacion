En este curso vamos a crear un nuevo servicio o *servlet* que nos devuelve un mensaje "hola mundo" en texto plano o XML, en función de un parámetro.

Los *servlets* son programas Java que se ejecutan en un servidor como respuesta a la petición de un cliente.

## Creando el proyecto

Puesto que queremos que la funcionalidad sea reutilizable, deberemos meter este servlet dentro de un plugin. Los plugins son proyectos Java que creamos con Maven.

En primer lugar, necesitaremos crear el esqueleto de un proyecto para poder trabajar. Lo podemos conseguir con el siguiente comando:

```bash
$ mvn archetype:generate -DgroupId=org.fao.unredd -DartifactId=hola-mundo -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

que creará un directorio `hola-mundo` con los ficheros y subdirectorios necesarios.

El fichero más importante para Maven es el fichero `pom.xml`, donde se define todo el funcionamiento del proyecto. En nuestro caso lo que queremos hacer es incluir las dependencias necesarias para los servlets:

```xml
<project ...>
  ...
  <dependencies>
    ...
	<dependency>
		<groupId>javax.servlet</groupId>
		<artifactId>javax.servlet-api</artifactId>
		<version>3.0.1</version>
		<scope>provided</scope>
	</dependency>
  </dependencies>
</project>
```

## Creando el servlet

Lo primero que tenemos que hacer es crear un fichero `web-fragment.xml` en `src/main/resources/META-INF` (habrá que crear el directorio) donde especificamos nuestro servicio:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-fragment version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd">
  <servlet>
    <servlet-name>holamundo-servlet</servlet-name>
    <servlet-class>org.fao.unredd.HolaMundoServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>holamundo-servlet</servlet-name>
    <url-pattern>/holamundo</url-pattern>
  </servlet-mapping>
</web-fragment>
```

En este fichero estamos asociando el servlet ``holamundo-servlet`` con la URL `/holamundo` y además estamos indicando que lo implementa con la clase ``org.fao.unredd.HolaMundoServlet``. Ahora sólo tenemos que implementarla:

```java
package org.fao.unredd;

import javax.servlet.http.HttpServlet;

public class HolaMundoServlet extends HttpServlet{
}
```

La única particularidad del código anterior es que el servlet debe extender a `javax.servlet.http.HttpServlet`.

Llegados a este punto tenemos que empaquetar nuestro plugin y desplegarlo con el portal. Para ello, primero empaquetamos nuestro plugin y lo instalamos en local:

```bash
cd hola-mundo
mvn package
```

Posteriormente, tendremos que copiar nuestro plugin en el directorio de plugins de la aplicación, dentro de Tomcat:

```bash
cp target/hola-mundo-1.0-SNAPSHOT.jar ../portal/WEB-INF/lib
```

y luego, reiniciaremos el portal:

```bash
cd ..
docker-compose restart portal
```

Si hemos hecho todo correctamente será posible, previo reinicio del servidor, acceder a la URL [http://localhost/portal/holamundo](http://localhost:8082/portal/holamundo) y obtener un error `405: Method Not Allowed` (método no permitido). Podemos comprobar que el mensaje es distinto si accedemos a una URL inexistente, como [http://localhost/portal/holamundonoexiste](http://localhost:8082/portal/holamundonoexiste), donde obtenemos `404: Not Found` (no encontrado).

Esto quiere decir que el servlet está bien instalado. Sólo hace falta implementar el método GET, que es el que está pidiendo el navegador:

```java
package org.fao.unredd;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HolaMundoServlet extends HttpServlet{

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
  }
}
```

Si volvemos a instalar en local, empaquetar y desplegar el plugin, el servidor debe devolver una página en blanco, pero no debe dar un error. Se llega así al punto en el que leeremos el parámetro y en función de este devolveremos un XML o texto plano:

```java
package org.fao.unredd;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HolaMundoServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    String outputformat = req.getParameter("outputformat");
    resp.setCharacterEncoding("utf-8");
    if ("xml".equals(outputformat)) {
      resp.setContentType("application/xml");
      resp.getWriter().write("<response>hola mundo</response>");
    } else {
      resp.setContentType("text/plain");
      resp.getWriter().write("hola mundo");
    }
  }
}
```