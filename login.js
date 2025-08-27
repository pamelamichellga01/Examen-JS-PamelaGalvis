// ========================================
// SISTEMA DE LOGIN FAKESTORE
// ========================================

class LoginSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.users = [];
        this.init();
    }

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    init() {
        this.loadUsersFromStorage();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupTabs();
    }

    // ========================================
    // CONFIGURACIÓN DE TABS
    // ========================================
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.form');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remover clase active de todos los tabs y forms
                tabBtns.forEach(b => b.classList.remove('active'));
                forms.forEach(f => f.classList.remove('active'));
                
                // Agregar clase active al tab y form seleccionado
                btn.classList.add('active');
                document.getElementById(`${targetTab}Form`).classList.add('active');
            });
        });
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    setupEventListeners() {
        // Formulario de Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Formulario de Registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Validación en tiempo real
        this.setupRealTimeValidation();

        // Botones sociales
        this.setupSocialButtons();
    }

    // ========================================
    // VALIDACIÓN EN TIEMPO REAL
    // ========================================
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldValidation(input));
        });
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validación específica por tipo
        switch (input.type) {
            case 'email':
                isValid = this.isValidEmail(value);
                errorMessage = 'Por favor ingresa un email válido';
                break;
            case 'password':
                isValid = value.length >= 6;
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                break;
            case 'text':
                if (input.id === 'registerName') {
                    isValid = value.length >= 2;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
        }

        // Aplicar validación visual
        this.applyFieldValidation(input, isValid);
        
        // Mostrar mensaje de error si es necesario
        if (!isValid && value !== '') {
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    applyFieldValidation(input, isValid) {
        input.classList.remove('valid', 'invalid');
        if (input.value.trim() !== '') {
            input.classList.add(isValid ? 'valid' : 'invalid');
        }
    }

    clearFieldValidation(input) {
        input.classList.remove('valid', 'invalid');
        this.hideFieldError(input);
    }

    showFieldError(input, message) {
        // Remover error anterior si existe
        this.hideFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--error-color);
            font-size: 0.8rem;
            margin-top: 0.5rem;
            padding-left: 3rem;
        `;
        
        input.parentNode.appendChild(errorDiv);
    }

    hideFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // ========================================
    // MANEJO DE LOGIN
    // ========================================
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validar campos
        if (!this.validateLoginFields(email, password)) {
            return;
        }

        // Simular proceso de login
        const submitBtn = e.target.querySelector('.submit-btn');
        this.setLoadingState(submitBtn, true);

        try {
            // Simular delay de API
            await this.simulateApiCall(1000);
            
            const user = this.authenticateUser(email, password);
            
            if (user) {
                this.loginSuccess(user, rememberMe);
            } else {
                this.showNotification('Credenciales incorrectas. Intenta de nuevo.', 'error');
            }
        } catch (error) {
            this.showNotification('Error en el servidor. Intenta de nuevo.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    validateLoginFields(email, password) {
        if (!email || !password) {
            this.showNotification('Por favor completa todos los campos.', 'warning');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor ingresa un email válido.', 'warning');
            return false;
        }

        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres.', 'warning');
            return false;
        }

        return true;
    }

    authenticateUser(email, password) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    loginSuccess(user, rememberMe) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Guardar sesión
        this.saveSession(user, rememberMe);
        
        // Mostrar sección de logout
        this.showLogoutSection();
        
        // Mostrar notificación de éxito
        this.showNotification(`¡Bienvenido, ${user.name}!`, 'success');
        
        // Redirigir a la aplicación principal después de un delay
        setTimeout(() => {
            this.redirectToMainApp();
        }, 1500);
    }

    // ========================================
    // MANEJO DE REGISTRO
    // ========================================
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validar campos
        if (!this.validateRegisterFields(name, email, password, confirmPassword, acceptTerms)) {
            return;
        }

        // Simular proceso de registro
        const submitBtn = e.target.querySelector('.submit-btn');
        this.setLoadingState(submitBtn, true);

        try {
            // Simular delay de API
            await this.simulateApiCall(1500);
            
            if (this.userExists(email)) {
                this.showNotification('Este email ya está registrado.', 'warning');
                return;
            }

            const newUser = this.createUser(name, email, password);
            this.users.push(newUser);
            this.saveUsersToStorage();
            
            this.showNotification('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'success');
            
            // Cambiar a tab de login
            document.querySelector('[data-tab="login"]').click();
            
            // Limpiar formulario
            e.target.reset();
            
        } catch (error) {
            this.showNotification('Error en el servidor. Intenta de nuevo.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    validateRegisterFields(name, email, password, confirmPassword, acceptTerms) {
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Por favor completa todos los campos.', 'warning');
            return false;
        }

        if (name.length < 2) {
            this.showNotification('El nombre debe tener al menos 2 caracteres.', 'warning');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor ingresa un email válido.', 'warning');
            return false;
        }

        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres.', 'warning');
            return false;
        }

        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden.', 'warning');
            return false;
        }

        if (!acceptTerms) {
            this.showNotification('Debes aceptar los términos y condiciones.', 'warning');
            return false;
        }

        return true;
    }

    userExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    createUser(name, email, password) {
        return {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // En producción, esto debería estar hasheado
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
    }

    // ========================================
    // GESTIÓN DE SESIÓN
    // ========================================
    saveSession(user, rememberMe) {
        const sessionData = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            timestamp: Date.now(),
            rememberMe: rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('fakeStoreSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('fakeStoreSession', JSON.stringify(sessionData));
        }
    }

    checkAuthStatus() {
        const sessionData = this.getSessionData();
        
        if (sessionData && sessionData.user) {
            this.currentUser = sessionData.user;
            this.isAuthenticated = true;
            this.showLogoutSection();
            this.redirectToMainApp();
        } else {
            this.hideLogoutSection();
        }
    }

    getSessionData() {
        const localSession = localStorage.getItem('fakeStoreSession');
        const sessionSession = sessionStorage.getItem('fakeStoreSession');
        
        if (localSession) {
            return JSON.parse(localSession);
        } else if (sessionSession) {
            return JSON.parse(sessionSession);
        }
        
        return null;
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('fakeStoreSession');
        sessionStorage.removeItem('fakeStoreSession');
        
        this.hideLogoutSection();
        this.showNotification('Sesión cerrada exitosamente.', 'info');
        
        // Redirigir al login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    // ========================================
    // GESTIÓN DE LA SECCIÓN DE LOGOUT
    // ========================================
    showLogoutSection() {
        const logoutSection = document.getElementById('logoutSection');
        const userName = document.getElementById('userName');
        
        if (logoutSection && userName && this.currentUser) {
            logoutSection.style.display = 'block';
            userName.textContent = this.currentUser.name;
        }
    }

    hideLogoutSection() {
        const logoutSection = document.getElementById('logoutSection');
        if (logoutSection) {
            logoutSection.style.display = 'none';
        }
    }

    // ========================================
    // BOTONES SOCIALES
    // ========================================
    setupSocialButtons() {
        const googleBtn = document.querySelector('.social-btn.google');
        const facebookBtn = document.querySelector('.social-btn.facebook');

        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.handleSocialLogin('facebook'));
        }
    }

    handleSocialLogin(provider) {
        this.showNotification(`Login con ${provider} no implementado en esta demo.`, 'info');
    }

    // ========================================
    // FUNCIONES DE UTILIDAD
    // ========================================
    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    async simulateApiCall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    redirectToMainApp() {
        // Aquí puedes cambiar la URL a tu aplicación principal
        window.location.href = 'index.html';
    }

    // ========================================
    // SISTEMA DE NOTIFICACIONES
    // ========================================
    showNotification(message, type = 'info', duration = 4000) {
        const notificationsContainer = document.getElementById('notifications');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${iconMap[type]}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notificationsContainer.appendChild(notification);

        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('hiding');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }

    // ========================================
    // GESTIÓN DE STORAGE
    // ========================================
    saveUsersToStorage() {
        localStorage.setItem('fakeStoreUsers', JSON.stringify(this.users));
    }

    loadUsersFromStorage() {
        const storedUsers = localStorage.getItem('fakeStoreUsers');
        
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        } else {
            // Crear usuarios de demo
            this.createDemoUsers();
        }
    }

    createDemoUsers() {
        this.users = [
            {
                id: '1',
                name: 'Usuario Demo',
                email: 'demo@fakestore.com',
                password: '123456',
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            {
                id: '2',
                name: 'Admin',
                email: 'admin@fakestore.com',
                password: 'admin123',
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        ];
        
        this.saveUsersToStorage();
    }

    // ========================================
    // FUNCIÓN PARA TOGGLE DE CONTRASEÑA
    // ========================================
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input.parentNode.querySelector('.toggle-password i');
        
        if (input.type === 'password') {
            input.type = 'text';
            button.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            button.className = 'fas fa-eye';
        }
    }
}

// ========================================
// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    window.loginSystem = new LoginSystem();
    
    // Hacer la función togglePassword global para el onclick del HTML
    window.togglePassword = (inputId) => {
        window.loginSystem.togglePassword(inputId);
    };
});

// ========================================
// FUNCIONES GLOBALES ADICIONALES
// ========================================

// Función para mostrar/ocultar contraseña (compatibilidad con onclick)
function togglePassword(inputId) {
    if (window.loginSystem) {
        window.loginSystem.togglePassword(inputId);
    }
}

// Función para verificar si el usuario está autenticado
function isUserAuthenticated() {
    return window.loginSystem && window.loginSystem.isAuthenticated;
}

// Función para obtener el usuario actual
function getCurrentUser() {
    return window.loginSystem ? window.loginSystem.currentUser : null;
}

// Función para cerrar sesión
function logout() {
    if (window.loginSystem) {
        window.loginSystem.logout();
    }
}
