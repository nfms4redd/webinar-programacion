Lo primero que tendremos que hacer es crear un nuevo plugin en el directorio de plugins, dentro del directorio de configuración del portal. Para más información sobre los plugins del portal, consultar la [documentación](https://geoladris.github.io/doc/dev/plugins/) de la plataforma. Nuestro plugin se llamará `hola-mundo`:

```bash
mkdir geoladris/portal/plugins/hola-mundo
```

Dentro de nuestro plugin, creamos un directorio `src` para el código:

```bash
mkdir geoladris/portal/plugins/hola-mundo/src
```

Y dentro de este directorio, creamos un nuevo fichero `hola-mundo.js` con el siguiente contenido:

```js
alert('Hola mundo');
```

Al recargar el portal nos encontraremos con el mensaje `Hola mundo` nada más empezar.
