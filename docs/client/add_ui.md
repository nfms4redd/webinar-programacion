En este caso vamos a añadir un nuevo botón a la barra de herramientas del portal, que cuando se pulse muestre una alerta. Para ello crearemos un plugin llamado `boton`:

```bash
mkdir -p geoladris/portal/plugins/boton/src
```

Y crearemos un fichero `boton.js` vacío.

Para poder añadir el botón necesitamos obtener el elemento HTML de la barra de herramientas. Este elemento lo podemos obtener mediante el módulo del plugin  [toolbar](https://github.com/geoladris/plugins/blob/master/base/src/toolbar.js). Si nos fijamos en el módulo, podemos ver que devuelve un objeto jQuery con el elemento:

```js
  ...
  return divToolbar;
});
```

Puesto que el portal funciona con [RequireJS](http://requirejs.org/), bastará con definir nuestro módulo con `toolbar` como dependencia:

```js
define([ 'toolbar' ], function(toolbar) {
  // Aquí podemos utilizar toolbar como el objeto jQuery devuelto por el módulo
});
```

En este punto podríamos realizar una prueba para comprobar que tenemos una referencia válida al elemento. El siguiente código hace invisible la barra de herramientas:

```js
define([ 'toolbar' ], function(toolbar) {
  toolbar.hide();
});
```

Si hemos hecho todos los pasos correctamente, veremos que la barra de herramientas no aparece, ya que la hemos escondido en nuestro módulo.

Lo único que queda por hacer es reemplazar el código de prueba anterior por otro que cree un botón. Esto lo podemos hacer creando un tag ``<button>`` con jQuery::

```js
define([ 'toolbar' ], function(toolbar) {
  let button = document.createElement('button');
  button.id = 'miboton';
  button.className = 'blue_button';
  button.innerHTML = 'Púlsame';
  button.addEventListener('click', function() {
    alert('Botón pulsado');
  });

  toolbar.get(0).appendChild(button);
});
```

Por último podemos añadir un fichero `botón.css` para dar estilo al botón:

```css
#miboton {
  border: 0;
  margin: 12px;
}
```
