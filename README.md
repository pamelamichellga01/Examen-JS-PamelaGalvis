# 🛍️ FakeStore - Aplicación de E-commerce Modular

Una aplicación web de e-commerce completa y modular construida con JavaScript vanilla, HTML y CSS. Diseñada para ser fácilmente configurable y evaluable.

## ✨ Características Principales

### 🚀 **Funcionalidades Básicas (Siempre Activas)**
- **Catálogo de productos** con API de FakeStore
- **Sistema de carrito** completo
- **Filtros avanzados** (categoría, precio, búsqueda, ordenamiento)
- **Responsive design** para móviles y desktop
- **Persistencia de datos** en localStorage

### ⚙️ **Funcionalidades Modulares (Configurables)**
- **Sistema de favoritos** ❤️
- **Historial de productos vistos** 👁️
- **Comparador de productos** ⚖️
- **Sistema de cupones** 🎫
- **Sistema de valoraciones** ⭐
- **Notificaciones** 🔔
- **Modo oscuro** 🌙

## 🎯 Configuración Rápida

### **Activar/Desactivar Funcionalidades**

Para activar solo las funcionalidades que necesites en tu evaluación, edita el archivo `script.js`:

```javascript
const ACTIVATE_FEATURES = [
    'favorites',      // Sistema de favoritos
    'ratings',        // Sistema de valoraciones
    'compare',        // Comparador de productos
    'viewed',         // Historial de productos vistos
    'coupons',        // Sistema de cupones
    'notifications',  // Sistema de notificaciones
    'darkMode'        // Modo oscuro
];
```

**Ejemplo:** Si solo quieres favoritos y comparación:
```javascript
const ACTIVATE_FEATURES = ['favorites', 'compare'];
```

## 🛠️ Funcionalidades Detalladas

### 🛒 **Sistema de Carrito**
- **Agregar productos** con botón "Agregar al carrito"
- **Gestión de cantidades** (+/- botones)
- **Eliminar productos** individualmente
- **Vaciar carrito** completo
- **Checkout** simulado
- **Persistencia** en localStorage

### 🔍 **Sistema de Filtros**
- **Búsqueda por texto** en título y descripción
- **Filtro por categoría** (automático desde API)
- **Ordenamiento** por precio (asc/desc) y nombre (A-Z/Z-A)
- **Rango de precio** con slider
- **Filtros avanzados:**
  - Rating mínimo
  - Solo productos en stock

### ❤️ **Sistema de Favoritos**
- **Agregar/remover** productos a favoritos
- **Vista dedicada** en sidebar de funcionalidades
- **Persistencia** en localStorage
- **Indicador visual** en tarjetas de productos

### 👁️ **Historial de Productos Vistos**
- **Tracking automático** al hacer clic en imagen
- **Máximo 10 productos** en historial
- **Sin duplicados** (se mueve al inicio)
- **Acceso rápido** desde sidebar
- **Persistencia** en localStorage

### ⚖️ **Comparador de Productos**
- **Máximo 3 productos** para comparar
- **Modal detallado** con tabla de comparación
- **Propiedades comparadas:** categoría, precio, rating, descripción
- **Agregar/quitar** productos fácilmente
- **Botón de comparación** en sidebar

### 🎫 **Sistema de Cupones**
- **Cupones predefinidos:**
  - `DESCUENTO10` → 10% de descuento
  - `ENVIOGRATIS` → $5 de descuento en envío
- **Aplicación automática** en total del carrito
- **Feedback visual** del descuento aplicado
- **Remover cupón** fácilmente

### ⭐ **Sistema de Valoraciones**
- **Estrellas interactivas** (1-5 estrellas)
- **Valoración personal** por producto
- **Persistencia** en localStorage
- **Indicador visual** en tarjetas

### 🔔 **Sistema de Notificaciones**
- **Tipos:** success, error, info
- **Duración configurable** (por defecto 3 segundos)
- **Posicionamiento automático** en pantalla
- **Estilos diferenciados** por tipo

### 🌙 **Modo Oscuro**
- **Toggle automático** en header
- **Persistencia** de preferencia
- **Icono dinámico** (luna/sol)
- **Estilos CSS** completos

## 🎨 Interfaz de Usuario

### **Header**
- **Logo y navegación**
- **Barra de búsqueda** integrada
- **Icono del carrito** con contador
- **Botón de modo oscuro** 🌙
- **Botón de funcionalidades** ⚙️

### **Sidebar del Carrito**
- **Lista de productos** agregados
- **Gestión de cantidades**
- **Sistema de cupones** integrado
- **Total con descuentos**
- **Botones de acción** (checkout, vaciar)

### **Sidebar de Funcionalidades**
- **Favoritos** con gestión completa
- **Productos vistos** con acceso rápido
- **Comparador** con botón de acción
- **Diseño deslizable** desde la derecha

### **Grid de Productos**
- **Tarjetas responsivas** con información completa
- **Botones de acción** (favoritos, comparar, agregar al carrito)
- **Indicadores visuales** (favorito, visto, rating)
- **Imágenes centradas** sin deformación

## 📱 Responsive Design

- **Desktop:** Layout completo con sidebars
- **Tablet:** Adaptación de elementos
- **Móvil:** Sidebars a pantalla completa
- **Breakpoints:** 768px, 480px

## 🚀 Instalación y Uso

### **Requisitos**
- Navegador web moderno
- Servidor local (opcional, para desarrollo)

### **Pasos de Instalación**
1. **Clona o descarga** el proyecto
2. **Abre `index.html`** en tu navegador
3. **Configura funcionalidades** editando `ACTIVATE_FEATURES`
4. **¡Listo para usar!**

### **Para Desarrollo**
```bash
# Servidor local simple (Python)
python -m http.server 8000

# O con Node.js
npx serve .
```

## 🔧 Personalización

### **Colores y Estilos**
- **Variables CSS** en `:root`
- **Gradientes** personalizables
- **Temas** fácilmente modificables

### **Funcionalidades**
- **Módulos independientes** para fácil activación/desactivación
- **Configuración centralizada** en `ACTIVATE_FEATURES`
- **Funciones modulares** con verificación de activación

### **API y Datos**
- **Endpoint configurable** en `fetchProducts()`
- **Estructura de datos** flexible
- **LocalStorage** personalizable

## 📊 Estructura del Proyecto

```
FakeStore/
├── index.html          # Estructura principal
├── script.js           # Lógica de la aplicación
├── styles.css          # Estilos y responsive
└── README.md           # Esta documentación
```

## 🎯 Casos de Uso

### **Para Estudiantes**
- **Evaluación modular** de funcionalidades
- **Aprendizaje** de JavaScript moderno
- **Práctica** de DOM manipulation
- **Ejemplo** de arquitectura modular

### **Para Desarrolladores**
- **Base** para proyectos e-commerce
- **Referencia** de implementación
- **Template** para aplicaciones modulares
- **Ejemplo** de buenas prácticas

## 🐛 Solución de Problemas

### **Problemas Comunes**
1. **Imágenes no cargan:** Verificar conexión a internet
2. **Funcionalidades no funcionan:** Verificar `ACTIVATE_FEATURES`
3. **Sidebar no se abre:** Verificar JavaScript en consola
4. **Estilos no se aplican:** Verificar archivo CSS

### **Debug**
- **Consola del navegador** para errores JavaScript
- **DevTools** para inspeccionar elementos
- **LocalStorage** para verificar persistencia

## 🔮 Futuras Mejoras

- **Paginación** de productos
- **Exportación** de datos
- **Más filtros** avanzados
- **Sistema de usuarios**
- **Historial de compras**
- **Recomendaciones** de productos

## 📝 Licencia

Este proyecto está diseñado para fines educativos y de evaluación.

## 🤝 Contribuciones

Las contribuciones son bienvenidas para mejorar la funcionalidad y documentación.

---

**¡Disfruta usando FakeStore! 🎉**

*Una aplicación e-commerce completa, modular y fácil de configurar.*
