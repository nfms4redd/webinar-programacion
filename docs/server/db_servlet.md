Ahora vamos a crear un servlet que nos muestre una lista con las provincias de Argentina.

## Cargando datos

Para ello, primero deberemos cargar las provincias en la base de datos. Nos descargamos los [datos](../static/provincias.zip) y los descomprimimos.

Luego ejecutamos el comando para cargarlos en la base de datos:

```bash
psql -h localhost -p 5432 -U admin -d nfms -f provincias.sql
```

y comprobamos que se hayan cargado correctamente:

```bash
psql -h localhost -p 5432 -U admin -d nfms -c 'SELECT COUNT(*) FROM provincias'
```

## Creando el proyecto

De nuevo, creamos el proyecto  y la configuración de nuestro servlet:

```bash
$ mvn archetype:generate -DgroupId=org.fao.unredd -DartifactId=guardar-centro -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

con su configuración en el fichero `pom.xml`:

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
	<dependency>
		<groupId>com.github.geoladris</groupId>
		<artifactId>core</artifactId>
		<version>7.0.0</version>
	</dependency>
  </dependencies>
</project>
```

y en el `web-fragment.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-fragment version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd">
  <servlet>
    <servlet-name>provincias-servlet</servlet-name>
    <servlet-class>org.fao.unredd.ProvinciasServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>provincias-servlet</servlet-name>
    <url-pattern>/provincias</url-pattern>
  </servlet-mapping>
</web-fragment>
```

## Creando el servlet

En este caso, nuestro servlet deberá conectar a la base de datos del portal. Para ello, existen diferentes alternativas, unas mejores que otras en función del contexto.

### Conexión manual a base de datos en Java

Cuando queremos conectar a la base de datos desde un servicio Java tenemos que utilizar la API JDBC (Java DataBase Connectivity).

En general, el código para conectar a una base de datos en Java es el siguiente:


```java
Class.forName("org.postgresql.Driver");
Connection connection = DriverManager.getConnection(
   "jdbc:postgresql://hostname:port/dbname","username", "password");
...
connection.close();
```

> En el código anterior estamos conectando a una base de datos PostgreSQL, para lo cual instanciamos el driver `org.postgresql.Driver` y conectamos usando la URL propia de PostgreSQL `jdbc:postgresql://hostname:port`. Estos dos aspectos cambiarán en función del tipo de base de datos a la que estemos conectando.

Primero, instanciamos el driver para que se autoregistre en el `DriverManager` y poder invocar después el método `getConnection` para obtener la conexión. Por último, es necesario cerrar la conexión.

Por medio del objeto de tipo `Connection` podremos obtener instancias de `Statement`, con las que se pueden enviar instrucciones SQL al servidor de base de datos.

### Conexión configurada en el portal

Aunque sería posible poner en el método ``doGet`` de nuestro servlet la creación de la conexión, no es recomendable ya que es un proceso costoso y ralentizaría nuestra aplicación.

Para evitar crear una conexión cada vez, el portal trae configurada una conexión de forma que sea Tomcat (el servidor) el que gestione las conexiones por nosotros. Pero, ¿cómo podemos obtener una de estas conexiones gestionadas por Tomcat?

El código Java cambia ligeramente, ya que ahora se obtiene un objeto de tipo `java.sql.DataSource` que es el que nos proporciona las conexiones:

```java
InitialContext context;
DataSource dataSource;
try {
  context = new InitialContext();
  dataSource = (DataSource) context.lookup("java:/comp/env/jdbc/nfms");
} catch (NamingException e) {
  throw new ServletException("Problema en la configuración");
}

try {
  Connection connection = dataSource.getConnection();
  // ...
  connection.close();
} catch (SQLException e) {
  throw new ServletException("No se pudo obtener una conexión");
}

try {
  context.close();
} catch (NamingException e) {
  // ignore
}
```

Si sutituímos la línea que contiene los puntos suspensivos por código que haga algo más interesante con la conexión, podemos devolver un JSON con el array de provincias que hay en la tabla que hemos cargado:

```java
package org.fao.unredd;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import net.sf.json.JSONSerializer;

public class ProvinciasDBServlet extends HttpServlet {
private static final long serialVersionUID = 1L;

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    InitialContext context;
    DataSource dataSource;
    try {
      context = new InitialContext();
      dataSource = (DataSource) context.lookup("java:/comp/env/jdbc/nfms");
    } catch (NamingException e) {
      throw new ServletException("Problema en la configuración");
    }

    List<String> provincias = new ArrayList<String>();
    try {
      Connection connection = dataSource.getConnection();
      Statement statement = connection.createStatement();
      ResultSet result = statement.executeQuery("SELECT fna FROM provincias");
      while (result.next()) {
        provincias.add(result.getString("name_1"));
      }

      resp.setContentType("application/json");
      JSONSerializer.toJSON(provincias).write(resp.getWriter());

      connection.close();
    } catch (SQLException e) {
      throw new ServletException("No se pudo obtener una conexión", e);
    }

    try {
      context.close();
    } catch (NamingException e) {
      throw new ServletException("No se pudo liberar el recurso");
    }
  }
}
```

Ahora, para probarlo tendremos que crear un plugin cliente con una lista que al cargar llame al servlet que acabamos de crear y rellene la lista con los nombres devueltos. Bastará crear un nuevo plugin con el siguiente módulo (para más detalles ver apartados sobre [cliente](../client/hello_world.md)):

```js
define([ "message-bus" ], function(bus) {
  var list = document.createElement('div');
  list.id = 'lista_provincias';
  document.body.appendChild(list);
  bus.send("ajax", {
    url : "provincias",
    success : function(json, textStatus, jqXHR) {
      var provincias = JSON.parse(json);
      for (var i = 0; i < provincias.length; i++) {
        var div = document.createElement('div');
        div.innerHTML = provincias[i];
        div.className = 'provincia';
        list.appendChild(div);
      }
    },
    errorMsg : "No se pudo obtener la lista de provincias"
  });
});
```

y los siguientes estilos:

```css

```

Por último, deberíamos poder instalar nuestro plugin, empaquetar la aplicación y reiniciar el portal para poder utilizar nuestro botón enlazado con nuestro servlet.
