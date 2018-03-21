En este apartado vamos a modificar el plugin anterior para que sea más flexible. Por ejemplo, si quisiéramos cambiar el separador del control de coordenadas, tendríamos que abrir el fichero `js` y modificarlo, lo cual puede ser un poco engorroso y más para un administrador que tal vez no conozca `js`.

Para ello, podemos utilizar configuración específica de cada módulo. Basta con añadir una dependencia especial llamada `module` y llamar a su función `config()`:

```js
define([ 'message-bus', 'ol2/map', 'module' ], function(bus, map, module) {
  let config = module.config();
  ...
});
```

El objeto que devuelve esta función (que nosotros hemos almacenado en una variable `config`), es el que se especifica en el fichero `public-conf.json` del [directorio de configuración](https://geoladris.github.io/doc/user/config/#configuracion-global). Así, podemos añadir lo siguiente al fichero `public-conf.json` para pasarle la configuración al módulo:

```json
{
	"coordenadas": {
    	"coordenadas": {
        	"separador": " , "
        }
    }
}
```

> **IMPORTANTE**: Podemos ver que tenemos que poner dos veces `coordenadas`. Esto es porque nuestro plugin se llama `coordenadas` (el más externo), que a su vez contiene un módulo que se llama igual, `coordenadas` (el más interno).

Una vez hecho esto, podemos utilizar el valor de `separador` en nuestro módulo. Quedaría así:

```js
define([ 'message-bus', 'ol2/map', 'module' ], function(bus, map, module) {
  let config = module.config();
  bus.listen('modules-loaded', function() {
    let olmap = map.getMap();
    let coords = document.createElement('div');
    coords.className = 'mapCoords';
    olmap.div.appendChild(coords);

    let control = new OpenLayers.Control.MousePosition({
      prefix : '<a target="_blank" href="http://spatialreference.org/ref/epsg/4326/">EPSG:4326</a> coordinates: ',
      div : coords,
      separator : config.separador,
      numDigits : 2,
      emptyString : 'Mouse is not over map.'
    });
    olmap.addControl(control);
  });
});
```
