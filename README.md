# API de AdoptMe - Entrega Final del Backend III (Coderhouse)

Este proyecto es un microservicio backend desarrollado en Node.js, Express y MongoDB, diseñado para gestionar un sistema de adopciones de mascotas. La API permite la administración de usuarios y mascotas, la creación de registros de adopción, generación de datos simulados para pruebas y una completa integración con Docker para facilitar su despliegue. Incluye documentación de API con Swagger y pruebas funcionales exhaustivas.

## 🚀 Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express.js**: Framework web para Node.js, utilizado para construir la API RESTful.
* **MongoDB**: Base de datos NoSQL para el almacenamiento de datos.
* **Mongoose**: ODM (Object Data Modeling) para MongoDB en Node.js, facilitando la interacción con la base de datos.
* **Docker**: Plataforma para desarrollar, enviar y ejecutar aplicaciones en contenedores.
* **Swagger (OpenAPI)**: Para la documentación interactiva de la API.
* **JWT (JsonWebToken)**: Para la autenticación y autorización de usuarios.
* **Bcrypt**: Para el hash seguro de contraseñas.
* **FakerJS**: Biblioteca para la generación de datos de prueba (mocks).
* **Multer**: Middleware para Node.js que facilita la subida de archivos (documentos de usuario).
* **Winston**: Biblioteca de logging para Node.js, utilizada para un manejo robusto de logs.
* **Compression**: Middleware de Express para comprimir las respuestas HTTP (gzip).
* **Dotenv**: Para la gestión de variables de entorno.
* **Mocha**: Framework de pruebas para JavaScript.
* **Chai**: Biblioteca de aserciones para pruebas.
* **Supertest**: Librería para probar APIs HTTP.

## 📦 Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/Paula-Osella/Backend3PrimeraPreentrega.git](https://github.com/Paula-Osella/Backend3PrimeraPreentrega.git)
    cd Backend3PrimeraPreentrega
    ```

2.  **Instalar las dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

    ```
    PORT=9090 # Puerto en el que la aplicación Express escuchará localmente
    MONGO_URL="mongodb+srv://tu_usuario:tu_password@adoptmecluster.bf2vbpt.mongodb.net/?retryWrites=true&w=majority&appName=AdoptmeCluster"
    JWT_SECRET_KEY="tuClaveSecretaJWT" # Una clave secreta fuerte para JWT
    # Puedes añadir otras variables si tu proyecto las necesita (ej. LOGGING_LEVEL)
    ```
    **Importante:** Asegúrate de reemplazar `tu_usuario` y `tu_password` con tus credenciales reales de MongoDB Atlas.

4.  **Iniciar el servidor (modo desarrollo):**

    ```bash
    npm run dev
    ```
    El servidor se iniciará en `http://localhost:9090`.

## 📄 Documentación de la API (Swagger)

Una vez que el servidor esté corriendo localmente, puedes acceder a la documentación interactiva de la API utilizando Swagger en la siguiente URL:

* **`http://localhost:9090/api-docs/`**

## 🧪 Pruebas Funcionales

El proyecto incluye pruebas funcionales utilizando Mocha, Chai y Supertest.

* **Ejecutar todas las pruebas:**

    ```bash
    npm test
    ```

* **Ejecutar pruebas por separado:**
    Para ejecutar un archivo de prueba específico, usa:

    ```bash
    npx mocha src/test/pets.router.test.js
    npx mocha src/test/users.router.test.js
    # Puedes añadir otros como:
    # npx mocha src/test/sessions.router.test.js
    # npx mocha src/test/adoptions.router.test.js
    ```

## 🐳 Dockerización

El proyecto está dockerizado, permitiendo una fácil construcción y ejecución en cualquier entorno que soporte Docker.

1.  **Construir la imagen Docker:**

    ```bash
    docker build -t paulaosella9/adoptme-app:latest .
    ```

2.  **Subir la imagen a Docker Hub:**

    ```bash
    docker push paulaosella9/adoptme-app:latest
    ```
    Puedes encontrar la imagen en Docker Hub aquí: [https://hub.docker.com/r/paulaosella9/adoptme-app](https://hub.docker.com/r/paulaosella9/adoptme-app)

3.  **Ejecutar el contenedor Docker:**
    Para ejecutar el contenedor y mapear el puerto `3000` interno del contenedor al puerto `3010` de tu máquina local (host), y pasar la URL de MongoDB como variable de entorno:

    ```bash
    docker run -p 3010:3000 -e MONGO_URL="mongodb+srv://paulaosella19:pOCtTrDLMKCs4kO1@adoptmecluster.bf2vbpt.mongodb.net/?retryWrites=true&w=majority&appName=AdoptmeCluster" -e PORT=3000 paulaosella9/adoptme-app:latest
    ```
    Una vez que el contenedor esté corriendo, la API será accesible en `http://localhost:3010`. La documentación de Swagger estará disponible en `http://localhost:3010/api-docs/`.

## 🌐 Endpoints de la API

A continuación, se describen los principales endpoints de la API. Para detalles completos y probarlos, utiliza la documentación de Swagger.

### Rutas de Usuarios (`/api/users`)

* **`GET /api/users`**
    * **Descripción:** Obtiene todos los usuarios registrados en el sistema.
    * **Respuestas:** `200 OK` (lista de usuarios), `500 Internal Server Error`.

* **`GET /api/users/:uid`**
    * **Descripción:** Obtiene un usuario específico por su ID.
    * **Parámetros:** `uid` (ID del usuario, en el path).
    * **Respuestas:** `200 OK` (usuario encontrado), `404 Not Found` (usuario no encontrado), `500 Internal Server Error`.

* **`PUT /api/users/:uid`**
    * **Descripción:** Actualiza la información de un usuario existente.
    * **Parámetros:** `uid` (ID del usuario, en el path).
    * **Body (JSON):**
        ```json
        {
          "first_name": "Juan",
          "last_name": "Pérez",
          "email": "juan@example.com"
        }
        ```
    * **Respuestas:** `200 OK` (usuario actualizado), `404 Not Found` (usuario no encontrado), `500 Internal Server Error`.

* **`DELETE /api/users/:uid`**
    * **Descripción:** Elimina un usuario del sistema por su ID.
    * **Parámetros:** `uid` (ID del usuario, en el path).
    * **Respuestas:** `200 OK` (usuario eliminado), `404 Not Found` (usuario no encontrado), `500 Internal Server Error`.

* **`POST /api/users/:uid/documents`**
    * **Descripción:** Sube documentos para un usuario específico.
    * **Parámetros:** `uid` (ID del usuario, en el path).
    * **Body (multipart/form-data):** Espera un campo `documents` que contenga uno o más archivos.
    * **Respuestas:** `200 OK` (documentos subidos), `400 Bad Request` (no se subieron archivos), `404 Not Found` (usuario no encontrado), `500 Internal Server Error`.

### Rutas de Sesiones y Autenticación (`/api/sessions`)

* **`POST /api/sessions/register`**
    * **Descripción:** Registra un nuevo usuario en el sistema.
    * **Body (JSON):**
        ```json
        {
          "first_name": "Nombre",
          "last_name": "Apellido",
          "email": "correo@example.com",
          "password": "unaContraseñaSegura"
        }
        ```
    * **Respuestas:** `201 Created` (usuario registrado exitosamente), `400 Bad Request` (valores incompletos o usuario ya existe), `500 Internal Server Error`.

* **`POST /api/sessions/login`**
    * **Descripción:** Inicia sesión de un usuario y establece una cookie de sesión JWT (`coderCookie`).
    * **Body (JSON):**
        ```json
        {
          "email": "correo@example.com",
          "password": "unaContraseñaSegura"
        }
        ```
    * **Respuestas:** `200 OK` (sesión iniciada), `400 Bad Request` (credenciales inválidas o valores faltantes), `404 Not Found` (usuario no encontrado), `500 Internal Server Error`.

* **`GET /api/sessions/current`**
    * **Descripción:** Obtiene la información del usuario actualmente autenticado a través de la cookie JWT.
    * **Respuestas:** `200 OK` (usuario autenticado), `401 Unauthorized` (token inválido o no presente).

* **`POST /api/sessions/logout`**
    * **Descripción:** Cierra la sesión del usuario, eliminando la cookie JWT.
    * **Respuestas:** `200 OK` (sesión cerrada), `401 Unauthorized` (no había sesión activa o token inválido).

* **`GET /api/sessions/unprotectedLogin`** (Solo para testing/desarrollo)
    * **Descripción:** Inicia sesión sin protección JWT (utilizando query params).
    * **Query Params:** `email`, `password`.
    * **Ejemplo:** `GET /api/sessions/unprotectedLogin?email=test@example.com&password=123`
    * **Respuestas:** `200 OK`, `400 Bad Request`, `404 Not Found`.

* **`GET /api/sessions/unprotectedCurrent`** (Solo para testing/desarrollo)
    * **Descripción:** Obtiene información del usuario autenticado sin protección JWT.
    * **Respuestas:** `200 OK`, `401 Unauthorized`.

### Rutas de Mascotas (`/api/pets`)

* **`GET /api/pets`**
    * **Descripción:** Obtiene todas las mascotas registradas.
    * **Respuestas:** `200 OK` (lista de mascotas), `500 Internal Server Error`.

* **`POST /api/pets`**
    * **Descripción:** Crea una nueva mascota.
    * **Body (JSON):**
        ```json
        {
          "name": "Firulais",
          "species": "Perro",
          "birthDate": "2020-01-01"
        }
        ```
    * **Respuestas:** `201 Created` (mascota creada), `400 Bad Request` (valores incompletos), `500 Internal Server Error`.

* **`PUT /api/pets/:pid`**
    * **Descripción:** Actualiza la información de una mascota existente.
    * **Parámetros:** `pid` (ID de la mascota, en el path).
    * **Body (JSON):**
        ```json
        {
          "name": "Luna Actualizada"
        }
        ```
    * **Respuestas:** `200 OK` (mascota actualizada), `404 Not Found` (mascota no encontrada), `500 Internal Server Error`.

* **`DELETE /api/pets/:pid`**
    * **Descripción:** Elimina una mascota del sistema por su ID.
    * **Parámetros:** `pid` (ID de la mascota, en el path).
    * **Respuestas:** `200 OK` (mascota eliminada), `404 Not Found` (mascota no encontrada), `500 Internal Server Error`.

### Rutas de Adopciones (`/api/adoptions`)

* **`GET /api/adoptions`**
    * **Descripción:** Obtiene todos los registros de adopción.
    * **Respuestas:** `200 OK` (lista de adopciones), `500 Internal Server Error`.

* **`GET /api/adoptions/:aid`**
    * **Descripción:** Obtiene un registro de adopción específico por su ID.
    * **Parámetros:** `aid` (ID de la adopción, en el path).
    * **Respuestas:** `200 OK` (adopción encontrada), `400 Bad Request` (ID de adopción inválido), `404 Not Found` (adopción no encontrada), `500 Internal Server Error`.

* **`POST /api/adoptions/:uid/:pid`**
    * **Descripción:** Crea un nuevo registro de adopción, asignando una mascota a un usuario.
    * **Parámetros:** `uid` (ID del usuario que adopta), `pid` (ID de la mascota a adoptar), ambos en el path.
    * **Respuestas:** `200 OK` (adopción creada), `400 Bad Request` (mascota ya adoptada), `404 Not Found` (usuario o mascota no encontrados), `500 Internal Server Error`.

### Rutas de Mocks y Generación de Datos (`/api/mocks`)

* **`GET /api/mocks/mockingpets`**
    * **Descripción:** Genera 100 mascotas falsas (sin guardar en la base de datos) y las devuelve. Útil para pruebas de frontend sin persistencia.
    * **Respuestas:** `200 OK` (lista de mascotas mock), `500 Internal Server Error`.

* **`GET /api/mocks/mockingusers`**
    * **Descripción:** Genera usuarios falsos (sin guardar en la base de datos). Puedes especificar la cantidad con un query parameter.
    * **Query Params:** `count` (opcional, número de usuarios a generar, por defecto 50).
    * **Ejemplo:** `GET /api/mocks/mockingusers?count=10`
    * **Respuestas:** `200 OK` (lista de usuarios mock), `400 Bad Request` (parámetro `count` inválido), `500 Internal Server Error`.

* **`POST /api/mocks/generateData`**
    * **Descripción:** Genera y guarda datos simulados (usuarios y/o mascotas) directamente en la base de datos.
    * **Body (JSON):**
        ```json
        {
          "users": 10,  // Cantidad de usuarios a generar y guardar (opcional, por defecto 0)
          "pets": 5    // Cantidad de mascotas a generar y guardar (opcional, por defecto 0)
        }
        ```
    * **Respuestas:** `201 Created` (datos insertados), `400 Bad Request` (parámetros inválidos), `500 Internal Server Error`.

### Rutas de Logger Test (`/api/loggerTest`)

* **`GET /api/loggerTest`**
    * **Descripción:** Endpoint de prueba para el sistema de logging, que activa diferentes niveles de logs (debug, info, warn, error, fatal).
    * **Respuestas:** `200 OK` (mensaje de logs generados), `500 Internal Server Error`.

## 🧑‍💻 Autor

* **Paula Osella**
* Desarrollador Backend | Coderhouse Backend III
* Julio ​​2025 – Córdoba, Argentina

---