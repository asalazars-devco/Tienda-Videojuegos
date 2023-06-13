# TIENDA DE VIDEOJUEGOS - DEVCO

Proyecto propuesto dentro del Semillero DEVCO.

Construir una API para una tienda de videojuegos que realice las operaciones CRUD.

Esta API está desarrollada con Node.js, Typescript y Express.

## Objetivos

<ul>
    <li> Desarrollar una API REST. </li>
    <li> Construirla con Arquitectura Hexagonal. </li>
    <li> Realizar la documentación en Swagger. </li>
    <li> Utilizar buenas prácticas de programación (Clean code, SOLID). </li>
    <li> Almacenar la información en una BD. </li>
    <li> Realizar contenerización en Docker [WIP]. </li>
    <li> Aplicar pruebas unitarias automatizadas [WIP]. </li>
    <li> Aplicar pruebas de código estático (SonarCloud). </li>
</ul>

## Requisitos

Antes de ejecutar la API, nos aseguramos de tener como mínimo instalado lo siguiente en nuestro entorno de desarrollo:

-   Node.js (versión 16.15.0).
-   PostgreSQL (versión 15.3).

## Instalación

1.  Clona el repositorio o descarga el código fuente del proyecto en tu entorno de desarrollo.

```
git clone https://github.com/asalazars-devco/Tienda-Videojuegos.git
```

2.  Navega hasta el directorio raíz del proyecto.
3.  Ejecuta el siguiente comando para instalar las dependencias:

```
npm install
```

4.  Crea la base de datos en PostgreSQL y ejecuta los siguientes querys de creación de tablas:

```
CREATE TABLE videojuegos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  precio NUMERIC(10, 2) NOT NULL,
  imagen TEXT,
  stock INTEGER
);

CREATE TABLE ordenes (
	id SERIAL PRIMARY KEY,
	videojuegos_comprados JSONB,
	cantidad INTEGER,
	valor_total NUMERIC(10, 2),
	id_usuario INTEGER
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  rol VARCHAR(20)
);
```

5.  Dentro de la tabla `usuarios`, crea un usuario de tipo `admin`.
6.  Crea un archivo `.env` en el directorio raíz del proyecto y agrega la configuración necesaria. Puedes utilizar el archivo `.env.example` como referencia.

    Este archivo contiene las credenciales necesarias para la conexión con la base de datos creada en el paso 4, además de otras configuraciones adicionales referentes a la creación y gestión de tokens de autenticación.

## Uso

1.  Asegúrate de que la base de datos PostgreSQL esté en funcionamiento y accesible.
2.  Ejecuta el siguiente comando para construir el servidor:

```
npm run tsc
```

3.  Luego, ejecuta el siguiente comando para iniciar la API:

```
npm start
```

4.  Si deseas ejecutar la API en modo desarrollo, puedes ejecutar el siguiente comando:

```
npm run dev
```

5.  La API estará disponible en `http://localhost:3000`
6.  Utiliza una herramienta como cURL, Postman o cualquier otro cliente HTTP para interactuar con los endpoints de la API.

## Endpoints

A continuación se muestra una lista de los principales endpoints disponibles en la API:

-   `/videojuego`: Endpoints para administrar videojuegos.
-   `/usuario`: Endpoints para administrar usuarios.
-   `/orden`: Endpoints para administrar órdenes de compra.

Consulta la documentación de la API (`documentacionAPI.yaml`) para obtener más detalles sobre los endpoints, los parámetros aceptados y las respuestas esperadas.
