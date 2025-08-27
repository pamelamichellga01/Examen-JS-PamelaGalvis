# 🚀 FAKE STORE APP - SISTEMA MODULAR

## 📋 CÓMO USAR EN TU EVALUACIÓN

### 🎯 **PASO 1: CONFIGURAR FUNCIONALIDADES**
Al inicio del archivo `script.js`, encuentra esta línea:

```javascript
const ACTIVATE_FEATURES = [
    'favorites',      // Sistema de favoritos
    'ratings',        // Sistema de valoraciones
    'compare',        // Comparador de productos
    'viewed',         // Historial de productos vistos
    'coupons',        // Sistema de cupones
    'notifications'   // Sistema de notificaciones
];
```

### 🔧 **PASO 2: ACTIVAR/DESACTIVAR FUNCIONALIDADES**
**Para activar una funcionalidad:** Agrega su nombre al array
**Para desactivar una funcionalidad:** Quita su nombre del array

#### 📝 **EJEMPLOS:**

**Solo favoritos y valoraciones:**
```javascript
const ACTIVATE_FEATURES = ['favorites', 'ratings'];
```

**Solo comparador de productos:**
```javascript
const ACTIVATE_FEATURES = ['compare'];
```

**Todas las funcionalidades:**
```javascript
const ACTIVATE_FEATURES = ['favorites', 'ratings', 'compare', 'viewed', 'coupons', 'notifications'];
```

**Ninguna funcionalidad adicional (solo carrito básico):**
```javascript
const ACTIVATE_FEATURES = [];
```

---

## 🎁 **FUNCIONALIDADES DISPONIBLES**

### 1. **❤️ FAVORITOS** (`'favorites'`)
- Botón de corazón en cada producto
- Guarda favoritos en localStorage
- Cambia color cuando está activo

### 2. **⭐ VALORACIONES** (`'ratings'`)
- Estrellas interactivas del 1 al 5
- Guarda valoraciones del usuario
- Muestra rating promedio de la API

### 3. **⚖️ COMPARADOR** (`'compare'`)
- Botón de balanza en cada producto
- Permite comparar hasta 3 productos
- Muestra notificación de productos agregados

### 4. **👁️ HISTORIAL VISTOS** (`'viewed'`)
- Rastrea productos visitados
- Guarda últimos 10 productos vistos
- Indicador visual de productos vistos

### 5. **🎫 CUPONES** (`'coupons'`)
- Sistema de cupones predefinidos
- Códigos: `DESCUENTO10` y `ENVIOGRATIS`
- Validación automática

### 6. **🔔 NOTIFICACIONES** (`'notifications'`)
- Notificaciones visuales temporales
- Diferentes tipos: success, error, warning, info
- Si está desactivado, usa console.log

---

## 🎯 **ESCENARIOS DE EVALUACIÓN COMUNES**

### **EVALUACIÓN BÁSICA (Carrito + 1 funcionalidad)**
```javascript
const ACTIVATE_FEATURES = ['favorites'];
```

### **EVALUACIÓN INTERMEDIA (Carrito + 2-3 funcionalidades)**
```javascript
const ACTIVATE_FEATURES = ['favorites', 'ratings', 'compare'];
```

### **EVALUACIÓN AVANZADA (Carrito + 4+ funcionalidades)**
```javascript
const ACTIVATE_FEATURES = ['favorites', 'ratings', 'compare', 'viewed', 'coupons'];
```

---

## 🚨 **IMPORTANTE PARA TU EVALUACIÓN**

### ✅ **VENTAJAS:**
- **Solo cambias 1 línea** para activar/desactivar funcionalidades
- **No hay código comentado** que pueda causar errores
- **Cada funcionalidad es independiente** y funciona por separado
- **Fácil de explicar** al profesor durante la defensa

### 📝 **DURANTE LA EVALUACIÓN:**
1. **Muestra el código** y explica que solo cambias el array
2. **Demuestra diferentes configuraciones** en vivo
3. **Explica que cada módulo es independiente**
4. **Muestra que no hay código muerto o comentado**

### 🔍 **SI TE PIDEN ALGO ESPECÍFICO:**
- **"Agrega favoritos"** → Cambia a `['favorites']`
- **"Agrega valoraciones"** → Cambia a `['ratings']`
- **"Agrega comparador"** → Cambia a `['compare']`
- **"Combina varias"** → Agrega múltiples al array

---

## 💡 **TRUCOS PARA LA EVALUACIÓN**

### **1. PREPARA VARIAS CONFIGURACIONES:**
```javascript
// Configuración 1: Solo favoritos
const ACTIVATE_FEATURES = ['favorites'];

// Configuración 2: Favoritos + valoraciones
const ACTIVATE_FEATURES = ['favorites', 'ratings'];

// Configuración 3: Todas las funcionalidades
const ACTIVATE_FEATURES = ['favorites', 'ratings', 'compare', 'viewed', 'coupons', 'notifications'];
```

### **2. EXPLICA EL SISTEMA MODULAR:**
- "Cada funcionalidad es un módulo independiente"
- "Solo se inicializa si está en el array ACTIVATE_FEATURES"
- "No hay código muerto o comentado"
- "Fácil de mantener y escalar"

### **3. DEMUESTRA EN VIVO:**
- Cambia el array y recarga la página
- Muestra que las funcionalidades aparecen/desaparecen
- Explica que el código base siempre funciona

---

## 🎉 **RESULTADO FINAL**

Con este sistema modular:
- ✅ **No más código comentado**
- ✅ **No más errores por funciones no definidas**
- ✅ **Fácil de activar/desactivar funcionalidades**
- ✅ **Profesional y fácil de explicar**
- ✅ **Perfecto para evaluaciones**

**¡Solo cambias una línea y todo funciona!** 🚀
