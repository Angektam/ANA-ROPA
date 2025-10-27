# 💖 Boutique Ana - Moda Femenina Elegante

Una boutique de moda femenina moderna y elegante construida con Angular, diseñada especialmente para la mujer moderna que busca expresar su personalidad única a través de prendas exclusivas y de alta calidad.

## ✨ Características

### 🎨 Diseño Femenino y Elegante
- **Paleta de colores suaves**: Rosa, coral y tonos elegantes
- **Tipografía elegante**: Poppins y Playfair Display
- **Elementos decorativos**: Animaciones sutiles y emojis femeninos
- **Diseño responsive**: Perfecto en todos los dispositivos

### 🛍️ Funcionalidades de E-commerce
- **Catálogo completo**: Vestidos, blusas, faldas, accesorios y más
- **Filtros avanzados**: Por categoría, precio, talla, color, ocasión, estilo y material
- **Carrito de compras**: Gestión completa de productos
- **Lista de deseos**: Guarda tus prendas favoritas
- **Búsqueda inteligente**: Encuentra exactamente lo que buscas

### 🎯 Experiencia de Usuario
- **Navegación intuitiva**: Diseño centrado en la mujer
- **Categorías específicas**: Vestidos de noche, blusas elegantes, joyería
- **Servicios premium**: Personal shopper, consulta de estilo
- **Testimonios reales**: Experiencias de clientas satisfechas

## 🚀 Tecnologías Utilizadas

- **Angular 17+**: Framework principal
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos avanzados y variables CSS
- **Font Awesome**: Iconografía elegante
- **Google Fonts**: Tipografías premium
- **JSON Server**: API de desarrollo

## 📦 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- npm 9+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Angektam/ANA.git

# Navegar al directorio del proyecto
cd ANA/boutique-ropa

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo + API
npm start           # Solo servidor de desarrollo

# Construcción
npm run build              # Build de producción
npm run build:gh-pages     # Build para GitHub Pages

# Testing
npm test            # Ejecutar tests
```

## 🌐 Despliegue

### GitHub Pages
El proyecto está configurado para desplegarse automáticamente en GitHub Pages:

1. **URL de producción**: `https://angektam.github.io/ANA/`
2. **Deploy automático**: Cada push a `main` activa el despliegue
3. **Configuración**: Workflow en `.github/workflows/deploy.yml`

### Configuración Local
```bash
# Build para GitHub Pages
npm run build:gh-pages

# Los archivos se generan en dist/boutique-ropa/browser/
```

## 🎨 Paleta de Colores

```scss
// Colores principales
--primary-color: #e91e63;      // Rosa elegante
--secondary-color: #9c27b0;    // Púrpura sofisticado
--accent-color: #ff6b9d;       // Coral vibrante

// Colores de fondo
--background-primary: #ffffff;  // Blanco puro
--background-secondary: #fef7f7; // Rosa muy suave
--background-light: #fce4ec;   // Rosa claro
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 640px, 768px, 1024px, 1280px
- **Grid System**: CSS Grid y Flexbox
- **Imágenes adaptativas**: Optimizadas para cada dispositivo

## 🛠️ Estructura del Proyecto

```
boutique-ropa/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── auth/           # Autenticación
│   │   │   ├── header/         # Navegación principal
│   │   │   ├── footer/         # Pie de página
│   │   │   ├── product-card/   # Tarjeta de producto
│   │   │   └── product-filter/ # Filtros avanzados
│   │   ├── pages/              # Páginas principales
│   │   │   ├── home/           # Página de inicio
│   │   │   ├── catalog/        # Catálogo de productos
│   │   │   ├── cart/           # Carrito de compras
│   │   │   └── wishlist/       # Lista de deseos
│   │   ├── services/           # Servicios Angular
│   │   └── models/             # Interfaces TypeScript
│   ├── styles.scss             # Estilos globales
│   └── index.html              # HTML principal
├── .github/workflows/          # CI/CD
└── package.json                # Dependencias
```

## 🎯 Características Destacadas

### Para la Mujer Moderna
- **Categorías específicas**: Vestidos elegantes, blusas sofisticadas
- **Filtros por ocasión**: Trabajo, fiesta, boda, cita
- **Estilos diversos**: Elegante, casual, vintage, bohemio
- **Materiales premium**: Seda, algodón, lino, encaje

### Experiencia de Compra
- **Vista rápida**: Modal con detalles del producto
- **Comparación**: Compara productos fácilmente
- **Lista de deseos**: Guarda para más tarde
- **Carrito inteligente**: Gestión de tallas y colores

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo**: Angektam
- **Diseño**: Enfocado en la elegancia femenina
- **UX/UI**: Experiencia centrada en la mujer moderna

## 📞 Contacto

- **GitHub**: [@Angektam](https://github.com/Angektam)
- **Proyecto**: [Boutique Ana](https://github.com/Angektam/ANA)

---

💖 **Boutique Ana** - Tu estilo, tu elegancia, tu confianza ✨