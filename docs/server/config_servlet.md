En este caso vamos a crear un servlet que nos permita modificar el centro en el que se carga el mapa al arrancar.

El centro del mapa se define en las propiedades `map.centerLonLat` y `map.initialZoomLevel` del fichero `portal.properties`, por lo que nuestro servlet deberá modificar ese fichero con las coordenadas enviadas desde el navegador.

## Creando el proyecto

En primer lugar, volvemos a crear un esqueleto para nuestro plugin:

```bash
$ mvn archetype:generate -DgroupId=org.fao.unredd -DartifactId=guardar-centro -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

Volvemos a añadir las dependencias necesarias para los servlets y para trabajar con la configuración de Geoladris:

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

y configuramos nuestro fichero `src/main/resources/META-INF/web-fragment.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-fragment version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd">
  <servlet>
    <servlet-name>guardar-centro-servlet</servlet-name>
    <servlet-class>org.fao.unredd.GuardarCentroServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>guardar-centro-servlet</servlet-name>
    <url-pattern>/guardar-centro</url-pattern>
  </servlet-mapping>
</web-fragment>
```

## Creando el servlet

Ahora, deberemos implementar el servlet. Para ello, primero debemos obtener una referencia al fichero `portal.properties`, que está dentro del directorio de configuración.

Para esto, existe un objeto `Config`, que se puede obtener en los servlets de la siguiente manera:

```java
Config config = (Config) getServletContext().getAttribute(Geoladris.ATTR_CONFIG);
```

y que nos permite obtener el directorio de configuración y, por tanto, el fichero `portal.properties`:

```java
File propertiesFile = new File(config.getDir(), "portal.properties");
```

Una vez tenemos el fichero, cargaremos todas las propiedades en un objeto `Properties`:

```java
Properties properties = new Properties();
InputStream inStream = new FileInputStream(propertiesFile);
properties.load(inStream);
inStream.close();
```

modificaremos las propiedades a partir de los parámetros enviados:

```java
properties.put("map.centerLonLat", req.getParameter("lon") + "," + req.getParameter("lat"));
properties.put("map.initialZoomLevel", req.getParameter("zoomLevel"));
```

y guardaremos los cambios en el fichero:

```java
OutputStream outStream = new FileOutputStream(propertiesFile);
properties.store(outStream, null);
outStream.close();
```

Aquí se puede ver el servlet completo:

```java
package org.fao.unredd;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.geoladris.Geoladris;
import org.geoladris.config.Config;

public class GuardarCentroServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    Config config = (Config) getServletContext().getAttribute(Geoladris.ATTR_CONFIG);
    File propertiesFile = new File(config.getDir(), "portal.properties");

    Properties properties = new Properties();
    InputStream inStream = new FileInputStream(propertiesFile);
    properties.load(inStream);
    inStream.close();

    properties.put("map.centerLonLat", req.getParameter("lon") + "," + req.getParameter("lat"));
    properties.put("map.initialZoomLevel", req.getParameter("zoomLevel"));

    OutputStream outStream = new FileOutputStream(propertiesFile);
    properties.store(outStream, null);
    outStream.close();
  }
}
```

Ahora, para probarlo tendremos que crear un plugin cliente con un botón que ,cuando se pulse, llame al servlet que acabamos de crear enviando el centro del mapa en ese momento. Bastará crear un nuevo plugin con el siguiente módulo (para más detalles ver apartados sobre [cliente](../client/hello_world.md)):

```js
define([ "message-bus", "botonera/crear", "ol2/map" ], function(bus, botonera, olmap) {
  botonera("guardar centro", function() {
    var map = olmap.getMap();
    var center = map.getCenter();
    center.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
    var zoomLevel = map.getZoom();
    bus.send("ajax", {
      url : "guardar-centro?lon=" + center.lon + "&lat=" + center.lat + "&zoomLevel=" + zoomLevel,
      success : function(indicators, textStatus, jqXHR) {
        alert("centro guardado");
      },
      errorMsg : "No se pudo guardar el centro"
    });
  });
});
```

Por último, deberíamos poder instalar empaquetar nuestro plugin y reiniciar el portal para poder utilizar nuestro botón enlazado con nuestro servlet.

## Manejando errores

El servlet anterior parte de la base de que las peticiones que se hagan van a ser satisfactorias, se va a guardar el centro. Pero en la realidad esto no es la norma general. ¿Qué sucede si la petición no incluye los parámetros `lon`, `lat`, o `zoomLevel`? ¿Qué pasa si el fichero `portal.properties` ha sido eliminado?

El estándar HTML define una serie de códigos que pueden ayudar en la comunicación de estas condiciones excepcionales:

* `Ok (200)`: Ejecución satisfactoria.
* `Bad Request (400)`: La petición no pudo ser entendida por el servidor. Aquí se puede indicar que no fue especificado el parámetro. Es posible acompañar el código con un mensaje descriptivo.
* `Internal server error (500)`: Adecuado para indicar errores graves, irrecuperables, como un bug en el código o que el fichero `portal.properties`.

Para utilizar estos errores, basta con utilizar el método [HttpServletResponse.sendError](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/http/HttpServletResponse.html#sendError-int-):

Por ejemplo, en caso de que se desee enviar un código `Bad Request (400)` cuando el parámetro `lon` no esté presente:

```java
if (lon == null) {
  resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
  return;
}
```

Teniendo esto en cuenta, el servlet se podría escribir así:

```java
package org.fao.unredd;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.geoladris.Geoladris;
import org.geoladris.config.Config;

public class GuardarCentroServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    Config config = (Config) getServletContext().getAttribute(Geoladris.ATTR_CONFIG);
    File propertiesFile = new File(config.getDir(), "portal.properties");
    Properties properties = new Properties();
    String lon = req.getParameter("lon");
    String lat = req.getParameter("lat");
    String zoomLevel = req.getParameter("zoomLevel");

    if (lon == null || lat == null || zoomLevel == null) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Los parámetros lon, lat y zoomLevel son obligatorios.");
      return;
    }

    // Lectura del fichero
    try {
      FileInputStream inputStream = new FileInputStream(propertiesFile);
      properties.load(inputStream);
      inputStream.close();
    } catch (IOException e) {
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error grave en el servidor. Contacte al administrador");
      return;
    }

    properties.put("map.centerLonLat", req.getParameter("lon") + "," + req.getParameter("lat"));
    properties.put("map.initialZoomLevel", req.getParameter("zoomLevel"));

    // Escritura del fichero
    try {
      FileOutputStream outputStream = new FileOutputStream(propertiesFile);
      properties.store(outputStream, null);
      outputStream.close();
    } catch (IOException e) {
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error grave en el servidor. Contacte al administrador");
      return;
    }
  }
}
```
