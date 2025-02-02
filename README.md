# 📦 Proyecto Final - API de E-commerce

## 📝 Descripción
Este proyecto es una API RESTful desarrollada con **Node.js y Express** para gestionar productos y carritos de compra en un e-commerce. Permite crear, leer, actualizar y eliminar productos, así como administrar carritos y agregar productos a ellos.

## 🚀 Instalación y Configuración
### 1️⃣ **Clonar el repositorio**
```sh
 git clone <https://github.com/JonatanUribio7749/Proyecto_Backend_Jonatan_Uribio.git>
 cd Proyecto_Backend_Jonatan_Uribio
```
### 2️⃣ **Instalar dependencias**
```sh
 npm install
```
### 3️⃣ **Ejecutar el servidor**
```sh
 npm start
```
Por defecto, el servidor se ejecuta en **http://localhost:8080**

---

## 📂 Estructura del Proyecto
```
├── src/
│   ├── data/         # Archivos JSON (productos, carritos)
│   ├── public/       # Archivos estáticos (si es necesario)
│   ├── routes/       # Rutas de la API (products.js, carts.js)
│   ├── utils/        # Funciones auxiliares
│   ├── app.js        # Configuración de Express
│
├── package.json      # Dependencias y scripts
├── package-lock.json # Versión exacta de dependencias
├── README.md         # Documentación del proyecto
└── .gitignore        # Archivos a excluir de Git
```

---

## 📌 **Endpoints Disponibles**

### 🛍️ **Productos** (`/api/products`)
| Método | Endpoint | Descripción |
|--------|-----------------------------|----------------------------------------|
| GET | `/api/products/` | Obtiene todos los productos |
| GET | `/api/products/:id` | Obtiene un producto por ID |
| POST | `/api/products/` | Crea un nuevo producto |
| PUT | `/api/products/:id` | Actualiza un producto por ID |
| DELETE | `/api/products/:id` | Elimina un producto |

---

### 🛒 **Carritos** (`/api/carts`)
| Método | Endpoint | Descripción |
|--------|---------------------------------|----------------------------------------|
| POST | `/api/carts/` | Crea un nuevo carrito |
| GET | `/api/carts/` | Obtiene todos los carritos |
| GET | `/api/carts/:id` | Obtiene un carrito por ID |
| POST | `/api/carts/:id/product/:productId` | Agrega un producto al carrito |
| PUT | `/api/carts/:id/product/:productId` | Actualiza cantidad de un producto en el carrito |
| DELETE | `/api/carts/:id/product/:productId` | Elimina un producto del carrito |
| DELETE | `/api/carts/:id` | Elimina un carrito |

---

## 🛠️ **Tecnologías Utilizadas**
- **Node.js** (JavaScript en el backend)
- **Express.js** (Framework para API REST)
- **File System (fs)** (Persistencia en JSON)
- **Postman** (Para pruebas de la API)

---

## ✅ **Consideraciones Finales**
- Todos los productos y carritos están almacenados en archivos JSON en `src/data/`.
- Se valida que los IDs no se repitan.
- Se sigue la arquitectura modular separando rutas y lógica del servidor.

**📌 Autor:** _MARISOL ALCARAZ_  
**📅 Fecha de entrega:** _30/01/25_



