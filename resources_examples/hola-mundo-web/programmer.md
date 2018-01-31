# Tutorial programación portal

## Hola mundo web

La web se construye básicamente sobre tres estándares:

* HTML: Nos permite definir los objetos: textos, tablas, botones, imágenes, etc. de forma jerárquica en un documento llamado DOM (Document Object Model). Dicho de otra manera: una página HTML consiste en un DOM, que es un árbol de objetos definidos por este estándar. 
* CSS: Nos permite controlar el estilo de los elementos HTML, es decir, la forma en la que se muestran al usuario. Ejemplos de aspectos que se pueden controlar desde CSS es: color, si un elemento es visible o no, tamaño de la letra, borde y un largo etcétera
* Javascript: Nos permite hacer que la página HTML/CSS interactúe con el usuario. Por ejemplo, podemos mostrar una imagen cuando se pincha en un botón o controlar que antes de enviar un formulario todos los datos son correctos.

A continuación se muestran algunos aspectos mediante ejemplos. Estos ejemplos no necesitan situarse en un servidor y pueden visualizarse desde el propio sistema de ficheros. Más adelante, con el uso de Geoladris veremos que sí que hace falta un componente en el servidor.

Podemos empezar por ver una [página HTML sencilla](ejemplos/hola-mundo-web/base.html).

El elemento `h1` existente en el ejemplo anterior tiene el estilo por defecto, pero con el uso de CSS podemos, por ejemplo, [cambiarle el color](ejemplos/hola-mundo-web/hola-css-style-element.html).

En dicho ejemplo hemos establecido el estilo de todos los elementos h1 con un elemento `style`. Si tenemos varios elementos `h1` y sólo queremos cambiar uno de ellos es posible [establecer el atributo `style` del elemento concreto](ejemplos/hola-mundo-web/hola-css-style-attribute.html).

Pero en general es buena idea separar el estilo del contenido, ya que el estilo se suele cambiar con frecuencia (sin ir más lejos, en función del dispositivo con el que se visualiza la página). Para ello, podemos darle un identificador al título y volver al elemento `style` pero esta vez [aplicándolo sólo al título que nos interesa](ejemplos/hola-mundo-web/hola-css-style-id.html).

Y si hubiera varios elementos a los que queremos aplicar un mismo estilo, es posible clasificarlos en un grupo (clase) y [aplicar el estilo a esa clase](ejemplos/hola-mundo-web/hola-css-style-class.html).

Por último, es posible también meter los estilos en un fichero separado y [enlazarlo desde el HTML](ejemplos/hola-mundo-web/hola-css-style-class-external.html)

Es importante retener que los estilos forman parte del DOM y que es posible seleccionar elementos concretos por id con el selector `#` y clasificar elementos y seleccionarlos con el selector `.`

Por otra parte, con el uso de Javascript podemos interactuar con el usuario, por ejemplo [decirle qué hora es](ejemplos/hola-mundo-web/hola-javascript.html)

Pero la parte que más nos va a interesar de Javascript es [modificar el DOM de la página](ejemplos/hola-mundo-web/js-dom.html), que recordamos también incluía aspectos de estilo.

## jQuery

En sus inicios, [jQuery](http://jquery.com) permitía manipular el DOM de una manera más sencilla y compatible con todos los navegadores, que implementaban el estándar de manera distinta. Actualmente, los navegadores respetan más estrictamente el estándar y cada vez tiene menos sentido utilizar jQuery. En cualquier caso, es una librería ampliamente utilizada en el portal de diseminación, por lo que es conveniente tener conocimiento de la misma. 

La modificación del DOM vista en el ejemplo anterior se puede implementar utilizando jQuery. Para ello hay que copiar la librería junto con la página HTML e importarla desde el DOM con un tag `script`, como se puede ver en [este ejemplo](ejemplos/jquery/jquery-dom.html).

## RequireJS

Los problemas con el modo anterior de crear las páginas HTML dinámicas es que cuando empezamos a añadir muchas funcionalidades el fichero puede crecer enormemente y ser difícil de entender y por tanto de mantener y extender.

Para evitar esto podemos utilizar otra librería llamada [RequireJS](http://requirejs.org/) que permite el empaquetado de ficheros javascript en módulos y gestiona las dependencias entre estos módulos.

El ejemplo anterior podemos implementarlo con RequireJS [así](ejemplos/requirejs/hola-requirejs/hola-requirejs.html) 

A continuación se plantea una serie de ejercicios que vamos a ir resolviendo añadiendo nuevos módulos al ejemplo anterior y detectando algunos aspectos a tener en cuenta.

* Ejercicio: [Crear el H1 con Javascript](ejemplos/requirejs/h1-modulo/h1-modulo.html) 
    * Dependencia en evento-mouse para que h1-modulo se cargue antes
* Ejercicio: Modificar todos los módulos para que [el estilo inicial sea una clase css y el cambio de estilo sea otra](ejemplos/requirejs/all-css/all-css.html)
    * Hay que añadir la CSS a mano en el documento HTML.
* Ejercicio: Internacionalizar ambos módulos [con un tercero con las traducciones](ejemplos/requirejs/i18n/i18n.html).
    * valores de retorno del módulo i18n
* Ejercicio: Usar una nueva librería [para mostrar un mensaje al usuario en un diálogo](ejemplos/requirejs/mensaje-cool/mensaje-cool.html).
    * El nuevo módulo que usa la librería tenemos que importarlo desde ejemplo, ya que ningún otro módulo lo pide.
    * El módulo debe importar la librería y se debe configurar la ubicación de esta última.

El uso de requireJS tiene unas ventajas evidentes. Con RequireJS es fácil agrupar las funcionalidades en pequeños módulos que son más fácilmente localizables y mantenibles. Además se establece un árbol de dependencias entre módulos que ayuda a ver qué funcionalidades son requeridas por un módulo determinado. Sin embargo el concepto de módulo no encapsula a una funcionalidad. Cuando desarrollamos una funcionalidad:

* Desarrollamos módulos. Tal vez más de uno como es el caso de `evento-mouse`, que usa `traducciones`.
* Incluimos en el documento HTML hojas de estilo CSS
* Incluimos librerías externas en un directorio y configuramos RequireJS para que las encuentre.

Así, si queremos quitar una funcionalidad, tenemos que:

* quitar los módulos
* quitar la referencia en el módulo que los carga con la llamada `require(...)`
* quitar los CSS del HTML
* quitar las librerías y su configuración de RequireJS.

A continuación vamos a ver cómo el proyecto Geoladris permite el empaquetado de todos estos aspectos en un concepto "plugin" de más alto nivel.

## Resumen

Hasta ahora hemos visto

1. la instalación del portal de FAO en Tomcat, los problemas normales que obtenemos al instalarlo y cómo solucionarlos,
2. la existencia de un árbol de elementos (HTML) y estilos (CSS),
3. que programando Javascript podemos añadir interactividad,
4. dos recomendaciones al trabajar con HTML, CSS y Javascript:

    * Hay que separar los CSS del resto de cosas
    * Hay que evitar que los ficheros Javascript crezcan de forma descontrolada 

5. y un modelo de aplicación que se apoya en RequireJS para tener todos estos conceptos separados que hemos visto que no es práctico.

Ahora vamos a ver cómo desde Geoladris tratamos de trabajar con los estándares del web, HTML, CSS y Javascript, apoyándonos en RequireJS y algún otro concepto para hacer las aplicaciones modulares y eliminando la problemática encontrada con RequireJS.