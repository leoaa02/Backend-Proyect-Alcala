# 🛒 Backend eCommerce - Proyecto Final Coderhouse

Este proyecto es el backend de una aplicación de e-commerce, desarrollado como entrega final para el curso de Backend en Coderhouse. Utiliza Node.js, Express y MongoDB para gestionar productos y carritos con persistencia de datos.

## 🚀 Funcionalidades principales

### 📦 Gestión de productos (`/api/products`)
- Visualización de productos con **paginación**, **filtros** y **ordenamiento**.
- Filtros por **categoría** y **disponibilidad** (stock).
- Ordenamiento por precio ascendente o descendente (`sort=asc/desc`).
- Consulta detallada por ID.
- Vista de productos (`/products`) con paginación y botones "Agregar al carrito".
- Vista individual por producto (`/products/:pid`).

### 🛒 Gestión de carritos (`/api/carts`)
- Crear carritos y agregar productos con cantidad específica.
- Eliminar productos individuales o vaciar carrito completo.
- Actualizar cantidad de un producto.
- Actualizar todos los productos del carrito de una vez.
- Vista de carrito (`/carts/:cid`) con detalles completos (mediante `.populate()`).

### ✅ Validaciones y errores
- Control de errores por validaciones y IDs inválidos.
- Middleware centralizado para manejo de errores.
- Uso de `Toastify` para mostrar mensajes visuales en las vistas.

### 🧾 Formato de respuesta del endpoint paginado:
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1",
  "nextLink": "/api/products?page=3"
}

-Leonardo Alcalá
Proyecto Final - Curso Backend Coderhouse
Julio 2025