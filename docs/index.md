# Curso de programación de NFMS4REDD

El software utilizado para la diseminación de datos es un portal web, que hace uso de la [arquitectura cliente-servidor](https://es.wikipedia.org/wiki/Cliente-servidor).

En este curso se aprenderán a desarrollar nuevas funcionalidades para el portal. Se abordarán las dos facetas de la arquitectura por separado: por un lado la parte cliente, y por otro lado la parte servidor.

Además, se incluye un tercer apartado sobre el empaquetado y el despliegue de la funcionalidad desarrollada, de forma que pueda ser reutilizada con facilidad.


## Índice

* [Preparación](setup.md)
* [Cliente](client/index.md)

	* [Hola mundo](client/hello_world.md)
	* [Añadir elementos a la interfaz](client/add_ui.md)
	* [Manejar eventos](client/events.md)
	* [Añadir funcionalidad al mapa](client/add_map_functionality.md)

* [Servidor](server/index.md)

	* [Hola mundo](server/hello_world.md)
	* [Servlet de configuración](server/config_servlet.md)
	* [Acceso a base de datos](server/db_servlet.md)

* [Empaquetado y publicación](deploy/index.md)

	* [Empaquetar plugin cliente](deploy/client.md)
	* [Empaquetar plugin servidor](deploy/server.md)
	* [Crear una nueva aplicación](deploy/new_app.md)
	* [Licencias](deploy/licenses.md)
