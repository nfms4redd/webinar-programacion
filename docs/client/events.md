En el portal existe un bus de eventos que sirve para la comunicación entre todos los módulos. Se recomienda leer una introducción a este [patrón de diseño](https://geoladris.github.io/doc/dev/source_code/#patron-de-diseno-message-bus) si no se está familiarizado con él.

En este capítulo veremos cómo interactuar con la plataforma a través de estos eventos. Para ello vamos a crear un plugin que oculte todas las capas del mapa a la vez:

```bash
mkdir -p geoladris/portal/plugins/eventos/src
```

En este plugin tendremos que utilizar un **patrón** muy habitual que consiste en hacer dos cosas:

* Escuchar eventos y recoger información de ellos.
* Realizar una acción con la información obtenida.

## Escuchando eventos

Para ocultar las capas se utilizará el evento `layer-visibility`, al que se pasa el identificador de la capa y el valor de visibilidad. El valor de visibilidad es siempre falso, pero además se necesitará la lista de identificadores de todas las capas.

Para obtenerlos, es necesario añadir `message-bus` como dependencia, escuchar el evento `add-layer` y guardar el identificador de cada capa en un array:

```js
define([ 'message-bus' ], function(bus) {
  let layerIds = [];

  bus.listen('add-layer', function(e, layerInfo) {
    layerIds.push(layerInfo.id);
  });
});
```

## Enviando eventos

Una vez recopilados todos los identificadores, solo queda lanzar el mensaje para cada una de las capas.

Esto se hará en respuesta a la pulsación de un botón, utilizando el plugin `botonera` que hemos creado antes:

```js
define([ 'message-bus', 'botonera/crear' ], function(bus, crearBoton) {
  let layerIds = [];

  bus.listen('add-layer', function(e, layerInfo) {
    layerIds.push(layerInfo.id);
  });

  crearBoton('Todas invisibles', function() {
    layerIds.forEach(function(id) {
      bus.send('layer-visibility', id, false);
    });
  });
});
```
