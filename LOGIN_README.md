# 🔐 Sistema de Login - FakeStore

Un sistema de autenticación completo y moderno para la aplicación FakeStore, construido con JavaScript vanilla, HTML y CSS.

## ✨ Características Principales

### 🚀 **Funcionalidades del Login**
- **Sistema de tabs** para alternar entre Login y Registro
- **Validación en tiempo real** de formularios
- **Autenticación de usuarios** con localStorage
- **Sesiones persistentes** con opción "Recordarme"
- **Redirección automática** después del login exitoso
- **Sistema de notificaciones** visuales

### 📝 **Funcionalidades del Registro**
- **Validación completa** de todos los campos
- **Verificación de contraseñas** coincidentes
- **Aceptación de términos** obligatoria
- **Prevención de emails duplicados**
- **Creación automática** de cuentas

### 🎨 **Características de UI/UX**
- **Diseño responsive** para todos los dispositivos
- **Gradientes modernos** y animaciones suaves
- **Iconos FontAwesome** para mejor experiencia visual
- **Estados de loading** en botones de envío
- **Validación visual** con colores y mensajes
- **Toggle de contraseña** para mejor usabilidad

## 🎯 **Usuarios de Demo**

El sistema incluye usuarios predefinidos para pruebas:

| Email | Contraseña | Rol |
|-------|------------|-----|
| `demo@fakestore.com` | `123456` | Usuario Demo |
| `admin@fakestore.com` | `admin123` | Administrador |

## 🛠️ **Instalación y Uso**

### **1. Archivos del Sistema**
```
FakeStore/
├── login.html          # Página de login/registro
├── login.css           # Estilos del sistema de login
├── login.js            # Lógica de autenticación
└── LOGIN_README.md     # Esta documentación
```

### **2. Acceso al Sistema**
- Abre `login.html` en tu navegador
- El sistema se inicializa automáticamente
- Los usuarios de demo se crean automáticamente en el primer uso

### **3. Flujo de Autenticación**
1. **Usuario no autenticado** → Redirigido a `login.html`
2. **Login exitoso** → Redirigido a `index.html` (aplicación principal)
3. **Sesión activa** → Acceso directo a la aplicación
4. **Logout** → Retorno a `login.html`

## 🔧 **Configuración y Personalización**

### **Cambiar URL de Redirección**
En `login.js`, línea 450:
```javascript
redirectToMainApp() {
    // Cambia esta URL a tu aplicación principal
    window.location.href = 'index.html';
}
```

### **Modificar Validaciones**
En `login.js`, función `validateField()`:
```javascript
validateField(input) {
    // Personaliza las reglas de validación aquí
    switch (input.type) {
        case 'email':
            // Tu lógica de validación de email
            break;
        case 'password':
            // Tu lógica de validación de contraseña
            break;
    }
}
```

### **Personalizar Estilos**
En `login.css`, variables CSS:
```css
:root {
    --primary-color: #667eea;      /* Color principal */
    --secondary-color: #764ba2;    /* Color secundario */
    --success-color: #2ed573;      /* Color de éxito */
    --error-color: #ff4757;        /* Color de error */
    /* ... más variables */
}
```

## 📱 **Responsive Design**

### **Breakpoints**
- **Desktop:** Layout completo con sidebars
- **Tablet (≤768px):** Adaptación de elementos
- **Móvil (≤480px):** Layout optimizado para pantallas pequeñas

### **Características Responsive**
- **Tabs apilados** en móvil
- **Botones sociales** en columna
- **Padding adaptativo** según tamaño de pantalla
- **Notificaciones** adaptadas a pantalla completa en móvil

## 🔒 **Seguridad y Almacenamiento**

### **LocalStorage**
- **Usuarios:** `fakeStoreUsers` - Lista de usuarios registrados
- **Sesión:** `fakeStoreSession` - Datos de sesión activa

### **SessionStorage**
- **Sesión temporal:** Para usuarios que no marcan "Recordarme"

### **Notas de Seguridad**
⚠️ **IMPORTANTE:** Este es un sistema de demo. En producción:
- **Hashear contraseñas** con bcrypt o similar
- **Implementar JWT** para tokens de sesión
- **Validar en servidor** todas las entradas
- **Usar HTTPS** para transmisión segura

## 🎭 **Sistema de Notificaciones**

### **Tipos de Notificación**
- **Success:** ✅ Verde - Operaciones exitosas
- **Error:** ❌ Rojo - Errores y fallos
- **Warning:** ⚠️ Amarillo - Advertencias
- **Info:** ℹ️ Azul - Información general

### **Características**
- **Auto-desaparición** configurable
- **Animaciones** de entrada y salida
- **Posicionamiento** fijo en pantalla
- **Botón de cierre** manual
- **Stacking** de múltiples notificaciones

## 🔄 **Integración con FakeStore**

### **Verificar Autenticación**
```javascript
// En tu aplicación principal
if (isUserAuthenticated()) {
    const user = getCurrentUser();
    console.log('Usuario autenticado:', user.name);
} else {
    // Redirigir al login
    window.location.href = 'login.html';
}
```

### **Cerrar Sesión**
```javascript
// Función global disponible
logout();
```

### **Obtener Usuario Actual**
```javascript
const currentUser = getCurrentUser();
if (currentUser) {
    console.log('ID:', currentUser.id);
    console.log('Nombre:', currentUser.name);
    console.log('Email:', currentUser.email);
}
```

## 🚀 **Funcionalidades Avanzadas**

### **Validación en Tiempo Real**
- **Validación al perder foco** (blur)
- **Limpieza automática** de errores al escribir
- **Estados visuales** (válido/inválido)
- **Mensajes de error** contextuales

### **Estados de Loading**
- **Botones deshabilitados** durante operaciones
- **Spinner animado** en botones de envío
- **Prevención de múltiples envíos**

### **Gestión de Sesiones**
- **Persistencia configurable** (localStorage vs sessionStorage)
- **Verificación automática** de sesión al cargar
- **Redirección inteligente** según estado de autenticación

## 🐛 **Solución de Problemas**

### **Problemas Comunes**

1. **"No se redirige después del login"**
   - Verificar que `index.html` existe en la misma carpeta
   - Revisar consola del navegador para errores

2. **"Las notificaciones no aparecen"**
   - Verificar que FontAwesome esté cargado
   - Revisar que el contenedor `#notifications` exista

3. **"La validación no funciona"**
   - Verificar que todos los IDs de input coincidan
   - Revisar consola para errores JavaScript

4. **"Los usuarios de demo no funcionan"**
   - Limpiar localStorage del navegador
   - Recargar la página para recrear usuarios

### **Debug**
- **Consola del navegador** para errores JavaScript
- **DevTools > Application** para ver localStorage
- **Verificar IDs** de elementos HTML

## 🔮 **Futuras Mejoras**

- **Integración con APIs** reales de autenticación
- **Sistema de roles** y permisos
- **Recuperación de contraseña** por email
- **Verificación de email** en registro
- **Autenticación de dos factores** (2FA)
- **Integración con OAuth** (Google, Facebook, etc.)
- **Sistema de auditoría** de logins
- **Rate limiting** para prevenir ataques de fuerza bruta

## 📝 **Licencia**

Este sistema de login está diseñado para fines educativos y de evaluación.

## 🤝 **Contribuciones**

Las contribuciones son bienvenidas para mejorar la funcionalidad y seguridad del sistema.

---

**¡Sistema de Login FakeStore listo para usar! 🔐✨**

*Un sistema de autenticación completo, seguro y fácil de integrar.*
