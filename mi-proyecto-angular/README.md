# 💖 Boutique Ana - Moda Femenina Elegante

**Tu estilo, tu elegancia, tu confianza** ✨

Una boutique online especializada en moda femenina de lujo, diseñada para realzar la belleza y confianza de la mujer moderna.

## 🌟 Características

- **Diseño 100% femenino** con paleta de colores elegante
- **Interfaz moderna y responsive** para todos los dispositivos
- **Navegación intuitiva** entre categorías de moda
- **Formularios de autenticación** (Login/Register)
- **Secciones temáticas**: Hero, Featured, Categories, Testimonials
- **Elementos decorativos** con animaciones suaves
- **Tipografía elegante** con Google Fonts

## 🛍️ Páginas Disponibles

- **Inicio** - Presentación de la boutique y productos destacados
- **Catálogo** - Exploración de productos por categorías
- **Carrito** - Gestión de compras
- **Lista de Deseos** - Productos favoritos
- **Checkout** - Proceso de compra
- **Login/Register** - Autenticación de usuarios

## 🎨 Diseño

- **Colores principales**: Rosa (#e91e63), Púrpura (#9c27b0), Coral (#ff6b9d)
- **Tipografías**: Poppins (sans-serif), Playfair Display (serif)
- **Estilo**: Elegante, sofisticado, femenino
- **Responsive**: Mobile-first design

## 🚀 Tecnologías

- **Angular 17** - Framework principal
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **HTML5** - Estructura semántica
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografías

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Angektam/boutique-ana.git

# Navegar al directorio
cd boutique-ana

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Build para producción
npm run build:gh-pages
```

## 🌐 Deploy

### GitHub Pages
El proyecto está configurado para deploy automático en GitHub Pages:
- URL: `https://angektam.github.io/boutique-ana/`
- Se actualiza automáticamente con cada push a `main`

### Netlify
```bash
# Deploy manual a Netlify
npm run build:gh-pages
npx netlify deploy --dir=dist/boutique-ana --prod
```

## 📁 Estructura del Proyecto

```
boutique-ana/
├── src/
│   ├── app/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── models/        # Interfaces TypeScript
│   │   └── services/      # Servicios Angular
│   ├── styles.scss       # Estilos globales
│   └── index.html        # Página principal
├── dist/                 # Build de producción
├── .github/workflows/    # GitHub Actions
├── netlify.toml         # Configuración Netlify
└── package.json         # Dependencias
```

## 🎯 Funcionalidades

- ✅ **Navegación completa** entre páginas
- ✅ **Diseño responsive** para móviles y desktop
- ✅ **Formularios funcionales** de autenticación
- ✅ **Animaciones suaves** y efectos visuales
- ✅ **Iconografía consistente** con Font Awesome
- ✅ **Tipografía elegante** con Google Fonts
- ✅ **Paleta de colores femenina** y sofisticada

## 🚀 Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run build:gh-pages` - Build para GitHub Pages
- `npm test` - Ejecutar tests
- `npm run dev` - Desarrollo con base de datos mock

## 📱 Responsive Design

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: 480px, 768px, 1024px, 1200px
- **Grid System**: CSS Grid y Flexbox
- **Typography**: Escalas responsivas

## 🎨 Personalización

El diseño está completamente personalizable a través de variables CSS en `src/styles.scss`:

```scss
:root {
  --primary-color: #e91e63;    // Rosa principal
  --secondary-color: #9c27b0;  // Púrpura secundario
  --accent-color: #ff6b9d;     // Coral de acento
  // ... más variables
}
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **GitHub**: [@Angektam](https://github.com/Angektam)
- **Proyecto**: [Boutique Ana](https://github.com/Angektam/boutique-ana)

---

💖 **Boutique Ana** - Tu estilo, tu elegancia, tu confianza ✨