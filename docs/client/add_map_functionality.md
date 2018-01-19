Cada vez que se quiere añadir un mapa OpenLayers en una página web se comienza escribiendo código en el que creamos el mapa:

```js
let map = new OpenLayers.Map('map', {
  theme : null,
  projection : new OpenLayers.Projection('EPSG:4326'),
  units : 'm',
  allOverlays : true,
  controls : []
});
```

para luego interactuar con él añadiéndole capas, instalando controles, etc.:

```js
map.addControl(new OpenLayers.Control.Navigation();
map.addControl(new OpenLayers.Control.MousePosition({
  prefix : '<a target="_blank" href="http://spatialreference.org/ref/epsg/4326/">' + 'EPSG:4326</a> coordinates: ',
  separator : ' | ',
  numDigits : 2,
  emptyString : 'Mouse is not over map.'
}));
```

Sin embargo, en el portal ya existe un mapa creado. ¿Cómo podemos obtener una referencia al mapa para poder utilizarlo? Necesitaremos dos cosas:

* Escuchar el evento `modules-loaded` para poder ejecutar nuestro código en el *callback*. Este evento se lanza cuando todos los módulos se han inicializado; es decir, han vuelto de la función de inicialización dentro del `define`. Escuchar este evento es necesario para asegurarnos de que el mapa está operativo.
* Obtener la referencia al mapa mediante `map.getMap()`. El módulo `ol2/map` no devuelve el mapa de OpenLayers directamente, sino un objeto con funciones. Una de ellas es `getMap` y sirve para obtener la instancia del mapa de OpenLayers. Esta función solo se puede llamar una vez el evento `modules-loaded` se ha enviado.

```js
define([ 'message-bus', 'ol2/map' ], function(bus, map) {
  bus.listen('modules-loaded', function() {
    let olmap = map.getMap();
    ...
  });
});
```

En este apartado vamos a crear un plugin que muestre las coordenadas que se están navegando. En este caso se llamará `coordenadas`:

```bash
mkdir -p geoladris/portal/plugins/coordenadas/src
```

Dentro crearemos un módulo `coordenadas.js` con el siguiente contenido:

```js
define([ 'message-bus', 'ol2/map' ], function(bus, map) {
  bus.listen('modules-loaded', function() {
    let olmap = map.getMap();
    let coords = document.createElement('div');
    coords.className = 'mapCoords';
    olmap.div.appendChild(coords);

    let control = new OpenLayers.Control.MousePosition({
      prefix : '<a target="_blank" href="http://spatialreference.org/ref/epsg/4326/">EPSG:4326</a> coordinates: ',
      div : coords,
      separator : ' | ',
      numDigits : 2,
      emptyString : 'Mouse is not over map.'
    });
    olmap.addControl(control);
  });
});
```

En el código podemos observar cómo se añade un elemento (`coords`) al elemento que contiene el mapa (`olmap.div`) para luego añadir un nuevo control (`OpenLayers.Control.MousePosition`) al mapa, utilizando ese elemento.

Por último, añadiremos algo de estilo al elemento que muestra las coordenadas:

```css
.mapCoords {
  position: absolute;
  bottom: 30px;
  left: 0px;
  background: white;
  padding: 10px;
  border: 1px solid gray;
  z-index: 999;
}
```

Y, al recargar el portal, tendremos nuestro control de coordenadas.