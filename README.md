Sistema de Gestión de Ventas - API REST

🚀 Descripción

Este proyecto es una API REST desarrollada con Spring Boot y MongoDB, diseñada para gestionar la venta de productos de una empresa.

Incluye funcionalidades para la administración de productos, ventas, clientes y usuarios, con autenticación basada en JWT y documentación con Swagger.

📂 Tecnologías Utilizadas

Java 17

Spring Boot

MongoDB (Base de datos NoSQL)

Spring Security con JWT (Autenticación)


⚙️ Instalación y Configuración

1️⃣ Clonar el repositorio

 git clone https://github.com/tu_usuario/tu_repositorio.git
 cd tu_repositorio

2️⃣ Configurar variables de entorno

Crear un archivo .env en la raíz del proyecto con la siguiente estructura:

MONGO_URI=mongodb://localhost:27017/tienda_db
JWT_SECRET=clave_secreta_para_jwt

3️⃣ Construir y ejecutar la aplicación

 mvn clean install
 mvn spring-boot:run

🔥 Endpoints Principales

📦 Productos

POST /productos → Crear producto (Solo Admin)

GET /productos → Listar productos

PUT /productos/{id} → Modificar producto (Solo Admin)

DELETE /productos/{id} → Desactivar producto (Solo Admin)

🛒 Ventas

POST /ventas → Registrar venta

GET /ventas → Listar ventas

GET /ventas/{id} → Obtener detalle de venta

👥 Usuarios

POST /auth/register → Registrar usuario (Solo Admin)

POST /auth/login → Iniciar sesión (JWT Token)

PUT /usuarios/{id} → Modificar usuario (Solo Admin)

DELETE /usuarios/{id} → Desactivar usuario (Solo Admin)

📊 Dashboard (Admin)

GET /dashboard/ventas-mensuales → Ventas por mes

GET /dashboard/productos-mas-vendidos → Productos más vendidos

GET /dashboard/stock-bajo → Productos con stock menor a 5

🛡️ Seguridad

La API usa JWT para autenticación. Para acceder a los endpoints protegidos:

Iniciar sesión en POST /auth/login

Copiar el token JWT y usarlo en Authorization: Bearer {token}
