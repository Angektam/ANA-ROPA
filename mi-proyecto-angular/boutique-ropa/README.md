# 🛍️ Boutique Ana - E-commerce de Ropa Femenina

Aplicación web profesional de e-commerce desarrollada con Angular 20, diseñada para ofrecer una experiencia de compra excepcional.

## ✨ Características Principales

### 🎨 Diseño y UX
- **Diseño Responsive Ultra Profesional** - Adaptable a todos los dispositivos (móvil, tablet, desktop)
- **Interfaz Moderna** - UI/UX siguiendo las mejores prácticas de diseño
- **Animaciones Suaves** - Transiciones y efectos visuales elegantes
- **Tema Premium** - Paleta de colores sofisticada y tipografía profesional

### 🛒 Funcionalidades de E-commerce
- **Catálogo Completo** - 30+ productos organizados en 6 categorías
- **Filtros Avanzados** - Por categoría, precio, talla, color y marca
- **Búsqueda Inteligente** - Búsqueda en tiempo real por nombre, descripción y tags
- **Vista Rápida** - Modal con información detallada del producto
- **Carrito de Compras** - Gestión completa de productos
- **Wishlist (Favoritos)** - Guarda tus productos favoritos
- **Sistema de Reseñas** - Calificaciones y comentarios de productos

### 👤 Gestión de Usuarios
- **Autenticación** - Sistema de login y registro
- **Perfil de Usuario** - Gestión de información personal
- **Historial de Pedidos** - Seguimiento de compras

### 🎯 Optimizaciones
- **Lazy Loading** - Carga diferida de imágenes para mejor rendimiento
- **LCP Optimizado** - Largest Contentful Paint mejorado
- **Código Limpio** - Sin logs de debug, código profesional

## 🚀 Tecnologías Utilizadas

- **Frontend:** Angular 20
- **Estilos:** SCSS con variables CSS personalizadas
- **Iconos:** Font Awesome
- **Backend Mock:** JSON Server
- **Base de Datos:** MySQL (schema incluido)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo y API mock
npm run dev

# Solo servidor Angular
npm start

# Solo API mock
npm run db
```

## 🌐 Endpoints

- **Frontend:** http://localhost:4200
- **API Mock:** http://localhost:3000
- **Productos:** http://localhost:3000/products
- **Categorías:** http://localhost:3000/categories

## 📂 Estructura del Proyecto

```
boutique-ropa/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── product-card/
│   │   │   ├── product-filter/
│   │   │   ├── quick-view-modal/
│   │   │   └── ...
│   │   ├── pages/           # Páginas principales
│   │   │   ├── home/
│   │   │   ├── catalog/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── wishlist/
│   │   ├── services/        # Servicios Angular
│   │   └── models/          # Modelos de datos
│   └── styles.scss          # Estilos globales
├── db.json                  # Base de datos mock
├── database.sql             # Schema MySQL
└── package.json
```

## 🎨 Categorías de Productos

1. **Vestidos** - Elegantes vestidos para toda ocasión
2. **Blusas** - Blusas cómodas y estilosas
3. **Pantalones** - Diferentes estilos y cortes
4. **Faldas** - Elegantes y versátiles
5. **Chaquetas** - Para completar tu look
6. **Accesorios** - Detalles que marcan la diferencia

## 💳 Funcionalidades de Checkout

- Formulario de envío completo
- Validación de datos
- Resumen de pedido
- Cálculo de costos de envío
- Confirmación de compra

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (<640px)
- 📱 **Tablets** (640px - 1024px)
- 💻 **Laptops** (1024px - 1440px)
- 🖥️ **Desktop** (>1440px)

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start           # Servidor Angular
npm run db          # API Mock
npm run dev         # Ambos servidores

# Producción
npm run build       # Build de producción
npm run watch       # Build en modo watch

# Testing
npm test            # Ejecutar tests
```

## 🎯 Mejores Prácticas Implementadas

- ✅ Componentes standalone (Angular 20)
- ✅ Lazy loading de imágenes
- ✅ Optimización de LCP
- ✅ Código limpio y organizado
- ✅ TypeScript estricto
- ✅ SCSS modular
- ✅ Responsive design
- ✅ Accesibilidad web

## 📄 Licencia

Este proyecto es privado y de uso educativo.

## 👨‍💻 Desarrollado con ❤️

Boutique Ana - Tu tienda de moda online favorita
