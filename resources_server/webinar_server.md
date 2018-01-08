# Curso de programación en servidor

## Prerrequisitos

credentials => usuario:webinar

Para este curso haremos uso de una máquina virtual con todo lo necesario. Esta máquina virtual contendrá:

* Java 8
* Maven 3
* Tomcat 8
* PostgreSQL 9.5
* jq

## Empaquetado y despliegue de una aplicación

### Empaquetado

En este curso crearemos un visor web a partir de plugins de Geoladris, que empaquetaremos como una aplicación web Java.

Geoladris es una plataforma sobre la que desarrollar funcionalidad reutilizable en forma de plugins. [Aquí](https://github.com/nfms4redd/webinar-programacion/blob/master/programmer.md#geoladris) se puede leer una introducción al contexto del proyecto y al funcionamiento de los plugins a nivel tecnológico.

Para empaquetar estos plugins haremos uso del script `geoladris_build.sh`, que se apoya en Maven para empaquetar la aplicación.

En primer lugar descargamos el script:

```bash
$ wget https://raw.githubusercontent.com/geoladris/core/master/scripts/geoladris_build.sh -P ~/bin
```

y le damos permisos de ejecución:

```bash
$ chmod +x ~/bin/geoladris_build.sh
```

Lo siguiente es crear un fichero `build.json` que describa nuestro visor:

```json
{
  "group" : "org.fao.unredd",
  "name" : "visor",
  "version" : "1.0.0",
  "plugins" : [ "base", "ol2", "de.csgis.geoladris:ui:1.0-SNAPSHOT" ],
  "maven_repositories" : {
    "csgis" : "http://service.csgis.de/mvn/repository/snapshots/"
  }
}
```

En este fichero definimos el nombre (`name`) y la versión (`version`) de nuestro visor, así como los `plugins` que utilizamos y los repositorios Maven externos (`maven_repositories`) donde se encuentren otros plugins que no sean de geoladris, como en este caso `ui` de CSGIS.

Una vez tenemos esto definido, únicamente tenemos que ejecutar el script en el directorio actual y esperar:

```bash
$ geoladris_build.sh
```

Este comando creará un fichero `visor-1.0.0.war` en el mismo directorio, listo para desplegar.

### Configuración

Para que los plugins que estamos usando sean reutilizables es necesario poder configurarlos. Para ello hay que crear un [directorio de configuración](http://geoladris-core.readthedocs.io/es/latest/configuring_apps/).

En nuestro caso, ese directorio será `/var/geoladris/visor` y contendrá un fichero `public-conf.json` con la configuración de los plugins:

```json
{
  "base" : {
    "banner" : {
      "hide" : true
    }
  }
}
```

, un fichero `layers.json` con la configuración de las capas del visor:

```json
{
	"wmsLayers": [{
		"id": "osm",
		"type": "osm",
		"osmUrls": [
			"http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
			"http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
			"http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
		]
	}, {
		"id": "limites",
		"label": "L\u00edmites provinciales",
		"baseUrl": "http://snmb.ambiente.gob.ar/geo-server/gwc/service/wms",
		"wmsName": "bosques_umsef_db:limites_provinciales",
		"imageFormat": "image/png8",
		"visible": true
	}],
	"portalLayers": [{
		"id": "osm",
		"active": true,
		"label": "Open Street Map",
		"layers": [ "osm" ]
	}, {
		"id": "limites",
		"label": "L\u00edmites provinciales",
		"active": true,
		"layers": [ "limites" ]
	}],
	"groups": [{
			"id": "layers",
			"label": "Capas",
			"items": [ "osm", "limites" ]
	}]
}
```

, un fichero `portal.properties` con el zoom inicial:

```js
map.centerLonLat=-58,-34
map.initialZoomLevel=5
```

y un fichero `static/overrides.css`:

```css
#layers_container {
  top: 50px;
}

#map {
  top: 0;
}

#toolbar, #layer_list_selector_pane, #toggle_legend {
  display: none;
}
```

### Despliegue

El fichero `.war` que contiene nuestra aplicación web necesita un contenedor de aplicaciones Java para funcionar. En nuestro caso, ese contenedor es Tomcat 8.

Lo primero que tenemos que hacer es definir en Tomcat el directorio de configuración de Geoladris que acabamos de crear. Para ello establecemos la variable de entorno `GEOLADRIS_CONFIG_DIR` en el fichero `/etc/default/tomcat8` añadiendo en cualquier punto:

```bash
GEOLADRIS_CONFIG_DIR=/var/geoladris
```

y reiniciamos Tomcat:

```bash
$ sudo service tomcat8 restart
```

Por último, solo nos queda desplegar nuestra aplicación `.war`:

```bash
$ sudo cp visor-1.0.0.war /var/lib/tomcat8/webapps/visor.war
```

y probar nuestro visor en http://localhost:8080/visor.

Otra de las cosas que es interesante observar es el log de Tomcat, que en la instalación se encuentra en el fichero `/var/log/tomcat8/catalina.out`. Para visualizarlo podemos ejecutar el siguiente comando:

```bash
$ tail -f /var/log/tomcat8/catalina.out
```

que deja bloqueada la línea de comandos y nos muestra el contenido del log a medida que va creciendo.

## Desarrollo de servlets

Los *servlets* son programas Java que se ejecutan en un servidor como respuesta a la petición de un cliente. En este curso vamos a implementar un servlet que accederá a la base de datos para obtener el valor de un indicador y se lo devolverá al cliente.

Puesto que queremos que la funcionalidad sea reutilizable, deberemos meterlo dentro de un plugin. Este plugin es un proyecto Java que vamos a crear con Maven.

En primer lugar, necesitaremos crear el esqueleto de un proyecto para poder trabajar. Lo podemos conseguir con el siguiente comando:

```bash
$ mvn archetype:generate -DgroupId=org.fao.unredd -DartifactId=db-indicator -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

que creará un directorio `db-indicator` con los ficheros y subdirectorios necesarios.

El fichero más importante para Maven es el fichero `pom.xml`, donde se define todo el funcionamiento del proyecto. En nuestro caso lo que queremos hacer es incluir las dependencias necesarias para los servlets:

```xml
<project ...>
  ...
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.1</version>
      <scope>test</scope>
    </dependency>
	<dependency>
		<groupId>javax.servlet</groupId>
		<artifactId>javax.servlet-api</artifactId>
		<version>3.0.1</version>
		<scope>provided</scope>
	</dependency>
  </dependencies>
</project>
```

Lo siguiente que haremos será crear nuestro servlet `DBIndicatorServlet.java` en `src/main/java/org/fao/unredd`:

```java
package org.fao.unredd;

import java.io.IOException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class DBIndicatorServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    try {
      Connection conn = DriverManager.getConnection(
          "jdbc:postgresql://localhost:5432/data",
          "user", "pass");
      Statement st = conn.createStatement();
      ResultSet result = st.executeQuery("SELECT value FROM test WHERE gid = 3");
      result.next();
      String value = result.getString(1);

      response.getWriter().write(value);
      response.setCharacterEncoding("UTF-8");
      response.setContentType("text/plain");
      response.setStatus(HttpServletResponse.SC_OK);
    } catch (SQLException e) {
      throw new IOException(e);
    }
  }
}
```

Además, para que Tomcat sepa que existe nuestro servlet, deberemos especificarlo en un fichero `web-fragment.xml` que se encuentra en `src/main/resources/META-INF`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-fragment version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd">
	<servlet>
		<servlet-name>db-indicator</servlet-name>
		<servlet-class>org.fao.unredd.DBIndicatorServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>db-indicator</servlet-name>
		<url-pattern>/db</url-pattern>
	</servlet-mapping>
</web-fragment>
```

Posteriormente, crearemos un módulo Javascript que llame al servlet al cargar el visor y muestre un elemento con el valor devuelto. El fichero debe estar contenido en `src/main/resources/geoladris/db-indicator/modules` y debe tener el siguiente contenido:

```js
define([ "jquery" ], function($) {
  $.ajax("db").success(function(response) {
    var div = document.createElement("div");
    div.id = "db-indicator";
    div.innerHTML = "Valor: " + response;
    document.body.appendChild(div);
  });
});
```

Finalmente, crearemos un fichero CSS junto al módulo para darle estilo al elemento creado:

```css
#db-indicator {
    position: fixed;
    z-index: 99;
    padding: 10px;
    bottom: 0;
    background: white;
    border: 1px solid gray;
}
```

Una vez tenemos nuestro plugin listo, únicamente debemos incluirlo en el fichero `build.json` de nuestra aplicación:

```json
{
  ...
  "plugins" : [ "base", "ol2", "de.csgis.geoladris:ui:1.0-SNAPSHOT", "org.fao.unredd:db-indicator:1.0-SNAPSHOT" ],
  ...
}
```
Sin embargo, si volvemos a ejecutar `geoladris_build.sh` nos devolverá un error:

```
...
[ERROR] Failed to execute goal on project visor: Could not resolve dependencies for project org.fao.unredd:visor:war:1.0.0: Could not find artifact org.fao.unredd:db-indicator:jar:1.0-SNAPSHOT in geoladris-releases (http://nullisland.geomati.co:8082/repository/releases/) -> [Help 1]
...
```

Esto es porque Maven no es capaz de encontrar el plugin que acabamos de crear. Para que pueda hacerlo, primero debemos instalar dicho plugin en nuestro sistema:

```bash
$ cd db-indicator
$ mvn install
$ cd ..
```

Una vez hecho esto, ya podemos volver a empaquetar nuestro visor con el nuevo plugin y desplegarlo de nuevo:

```bash
$ geoladris_build.sh
$ sudo cp visor-1.0.0.war /var/lib/tomcat8/webapps/visor.war
```

