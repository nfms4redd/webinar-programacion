En este apartado se proponen varios ejercicios con sus soluciones para practicar y ampliar los contenidos del curso:

1. Añade un botón que añada un nuevo grupo de capas con una capa WMS al mapa. Puede usar el servicio WMS `http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi` y la capa `nexrad-n0r-wmst`.

    **Solución**: [js](static/exercises/new-group-layer.js).

2. Añade un control con dos casillas para introducir latitud/longitud y un botón para hacer zoom a la coordenada especificada.

    **Solución**: [js](static/exercises/zoomto.js), [css](static/exercises/zoomto.css).

3. Añade una lista con nombres de países que cuando se pulsen hagan zoom al país seleccionado. Puedes utilizar los siguiente países y coordenadas:

    * Argentina: [ -62, -38 ].
    * Bolivia: [ -65, -19 ].
    * Ecuador: [ -78, 0 ].
    * Paraguay: [ -57, -25 ].

    **Solución**: [js](static/exercises/zoom-panel.js), [css](static/exercises/zoom-panel.css).

4. Añade un botón que active un control del mapa de forma que cuando se pulse en el mapa se obtenga la temperatura en el punto. Para ello puedes utilizar el servicio de Open Weather Map con la siguiente URL: `http://api.openweathermap.org/data/2.5/weather?APPID=d8cbabebfd28985fe4ca7ab08784de01&lat=<latitud>&lon=<longitud>`.

    **Solución**: [js](static/exercises/temperature.js), [css](static/exercises/temperature.css).

5. Añade un botón que active un control del mapa para realizar medidas. El control que hace esto es [OpenLayers.Control.Measure](http://dev.openlayers.org/docs/files/OpenLayers/Control/Measure-js.html). Al finalizar la medida basta con mostrar una alerta (`window.alert`) con la medida realizada.

    **Solución**: [js](static/exercises/measure.js).

6. Añade un control donde se pueda introducir un [filtro CQL](http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html) manualmente y al pulsar un botón filtre la capa *Límites provinciales* (configurada en el `public-conf.json`). Puedes utilizar el filtro `nprov LIKE 'BUENOS AIRES'` para probar.

    **Solución**: [js](static/exercises/filter.js).
