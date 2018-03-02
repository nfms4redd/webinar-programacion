En este apartado se proponen varios ejercicios con sus soluciones para practicar y ampliar los contenidos del curso:

1. Añade un botón que añada un nuevo grupo de capas con una capa WMS al mapa. Puede usar el servicio WMS `http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi` y la capa `nexrad-n0r-wmst`.

    **Solución**: [js](static/exercises/new-group-layer.js), [css](static/exercises/new-group-layer.css).

2. Añade un control con dos casillas para introducir latitud/longitud y un botón para hacer zoom a la coordenada especificada.

    **Solución**: [js](static/exercises/zoomto.js), [css](static/exercises/zoomto.css).

3. Añade una lista con nombres de países que cuando se pulsen hagan zoom al país seleccionado. Puedes utilizar los siguiente países y coordenadas:

    * Argentina: [ -62, -38 ].
    * Bolivia: [ -65, -19 ].
    * Ecuador: [ -78, 0 ].
    * Paraguay: [ -57, -25 ].

    **Solución**: [js](static/exercises/zoom-panel.js), [css](static/exercises/zoom-panel.css).

4. Añade un control que muestre la escala del mapa. El control que hace esto es [OpenLayers.Control.Scale](http://dev.openlayers.org/docs/files/OpenLayers/Control/Scale-js.html).

    **Solución**: [js](static/exercises/scale.js), [css](static/exercises/scale.css).

5. Añade un botón que active un control del mapa de forma que cuando se pulse en el mapa se obtenga la temperatura en el punto. Para ello puedes utilizar el servicio de Open Weather Map con la siguiente URL: `http://api.openweathermap.org/data/2.5/weather?APPID=d8cbabebfd28985fe4ca7ab08784de01&lat=<latitud>&lon=<longitud>`.

    **Solución**: [js](static/exercises/temperature.js), [css](static/exercises/temperature.css).

6. Añade un botón que active un control del mapa para realizar medidas. El control que hace esto es [OpenLayers.Control.Measure](http://dev.openlayers.org/docs/files/OpenLayers/Control/Measure-js.html). Al finalizar la medida basta con mostrar una alerta (`window.alert`) con la medida realizada.

    **Solución**: [js](static/exercises/measure.js).

7. Añade un control donde se pueda elegir la capa, el atributo de la tabla, el operador (`==`, `!=`, `<` `>`, `<=` `>=`, `~`) y un valor a introducir por el usuario, y al pulsar un botón se muestre una tabla con las filas que cumplan la condición (atributo - operador - valor).

    **Solución**: [js](static/exercises/wfs-query.js), [css](static/exercises/wfs-query.css).

8. Añade un control donde se pueda introducir un [filtro CQL](http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html) manualmente y al pulsar un botón filtre una capa (configurada en el `public-conf.json`).

    **Solución**: [js](static/exercises/filter.js), [css](static/exercises/filter.css).
