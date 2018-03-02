En este apartado vamos a crear un plugin que nos permita añadir botones a la barra de herramientas de manera sencilla, para reutilizarlo desde otros plugins. En este caso, nuestro plugin se llama `botonera`:

```bash
mkdir -p geoladris/portal/plugins/botonera/src
```

En nuestro plugin debemos de dar la posibilidad a otros plugins para que añadan elementos a la barra. Para ello vamos a hacer que nuestro plugin devuelva una función en el fichero `crear.js`. El código de esta función es prácticamente igual que el del plugin `boton` que implementamos anteriormente, pero recibiendo el texto del botón (`text`) y una función a ejecutar cuando se pulse (`callback`):

```js
define([ 'toolbar' ], function(toolbar) {
  return function(text, callback) {
    let button = document.createElement('button');
    button.className = 'blue_button';
    button.innerHTML = text;
    button.addEventListener('click', callback);

    toolbar.get(0).appendChild(button);
  }
});
```

Después, en otro módulo `saludo.js` podemos utilizar el módulo `crear.js` para añadir un nuevo botón:

```js
define([ './crear' ], function(crear) {
  crear('Saludo', function() {
    alert('Hola mundo');
  });
});
```
