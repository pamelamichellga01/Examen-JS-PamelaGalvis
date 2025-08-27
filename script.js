// ========================================
// FAKE STORE APP - VERSIÓN MODULAR
// ========================================
// Para activar funcionalidades en el examen, solo cambia:
// ACTIVATE_FEATURES = ['favorites', 'ratings', 'compare', etc.]

// CONFIGURACIÓN DE FUNCIONALIDADES
const ACTIVATE_FEATURES = [
    'favorites',      // Sistema de favoritos
    'ratings',        // Sistema de valoraciones
    'compare',        // Comparador de productos
    'viewed',         // Historial de productos vistos
    'coupons',        // Sistema de cupones
    'notifications',  // Sistema de notificaciones
    'darkMode'        // Modo oscuro
];

// ========================================
// MÓDULO PRINCIPAL DE LA APLICACIÓN
// ========================================
class FakeStoreApp {
    constructor() {
        // Propiedades básicas (SIEMPRE ACTIVAS)
        this.products = [];
        this.filteredProducts = [];
        this.cart = this.loadCartFromStorage();
        this.categories = [];
        this.currentFilters = {
            search: '',
            category: '',
            sort: '',
            maxPrice: 1000
        };
        
        // Inicializar funcionalidades según configuración
        this.initializeFeatures();
        
        // Iniciar aplicación
        this.init();
        
        // Cargar preferencias del modo oscuro
        this.loadDarkModePreference();
    }

    // ========================================
    // FUNCIÓN DEL SIDEBAR DE SETTINGS
    // ========================================
    
    toggleSettingsSidebar() {
        const sidebar = document.getElementById('settingsSidebar');
        const overlay = document.getElementById('settingsOverlay');
        
        if (!sidebar || !overlay) return;
        
        if (sidebar.classList.contains('open')) {
            this.hideSettingsSidebar();
        } else {
            this.showSettingsSidebar();
        }
    }
    
    showSettingsSidebar() {
        const sidebar = document.getElementById('settingsSidebar');
        const overlay = document.getElementById('settingsOverlay');
        
        if (!sidebar || !overlay) return;
        
        // Actualizar todas las vistas antes de mostrar
        this.updateFavoritesDisplay();
        this.updateViewedDisplay();
        this.updateCompareDisplay();
        
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
    
    hideSettingsSidebar() {
        const sidebar = document.getElementById('settingsSidebar');
        const overlay = document.getElementById('settingsOverlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    // Inicializar solo las funcionalidades activadas
    initializeFeatures() {
        // console.log('🚀 Inicializando FakeStore con funcionalidades:', ACTIVATE_FEATURES);
        
        // Verificar autenticación del usuario
        this.checkUserAuthentication();
        
        // Inicializar cada funcionalidad activada
        if (ACTIVATE_FEATURES.includes('favorites')) {
            this.favorites = this.loadFavoritesFromStorage();
            this.setupFavoritesSystem();
        }
        
        if (ACTIVATE_FEATURES.includes('viewed')) {
            this.viewedProducts = this.loadViewedProductsFromStorage();
            this.setupProductViewTracking();
        }
        
        if (ACTIVATE_FEATURES.includes('ratings')) {
            this.ratings = this.loadRatingsFromStorage();
            this.setupRatingSystem();
        }
        
        if (ACTIVATE_FEATURES.includes('compare')) {
            this.compareList = [];
            this.setupProductComparison();
        }
        
        if (ACTIVATE_FEATURES.includes('coupons')) {
            this.coupons = [
                { code: 'DESCUENTO10', discount: 10, type: 'percentage' },
                { code: 'ENVIOGRATIS', discount: 5, type: 'shipping' }
            ];
            this.setupCouponSystem();
        }
        
        if (ACTIVATE_FEATURES.includes('notifications')) {
            this.notifications = [];
            this.setupNotificationSystem();
        }
    }

    // ========================================
    // FUNCIONALIDADES BÁSICAS (SIEMPRE ACTIVAS)
    // ========================================
    
    async init() {
        await this.fetchProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartDisplay();
        this.populateCategories();
    }

    async fetchProducts() {
        try {
            this.showLoading(true);
            const response = await fetch('https://fakestoreapi.com/products');
            
            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }
            
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            this.showLoading(false);
        } catch (error) {
            console.error('Error:', error);
            this.showLoading(false);
            this.showError('Error al cargar los productos. Por favor, intenta de nuevo.');
        }
    }

    setupEventListeners() {
        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Filtro de categoría
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Filtro de ordenamiento
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Filtro de precio
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');
        if (priceRange && priceValue) {
            priceRange.addEventListener('input', (e) => {
                this.currentFilters.maxPrice = parseInt(e.target.value);
                priceValue.textContent = `$${e.target.value}`;
                this.applyFilters();
            });
        }

        // Filtros avanzados
        const ratingFilter = document.getElementById('ratingFilter');
        const ratingValue = document.getElementById('ratingValue');
        const stockFilter = document.getElementById('stockFilter');
        
        if (ratingFilter && ratingValue) {
            ratingFilter.addEventListener('input', (e) => {
                ratingValue.textContent = e.target.value;
                this.currentFilters.minRating = parseFloat(e.target.value);
                this.applyFilters();
            });
        }
        
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.currentFilters.stockOnly = e.target.checked;
                this.applyFilters();
            });
        }

        // Carrito
        const cartIcon = document.getElementById('cartIcon');
        const closeCart = document.getElementById('closeCart');
        const cartOverlay = document.getElementById('cartOverlay');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartIcon) cartIcon.addEventListener('click', () => this.toggleCart());
        if (closeCart) closeCart.addEventListener('click', () => this.toggleCart());
        if (cartOverlay) cartOverlay.addEventListener('click', () => this.toggleCart());
        if (clearCartBtn) clearCartBtn.addEventListener('click', () => this.clearCart());
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.checkout());

        // Modal
        const closeModal = document.getElementById('closeModal');
        const continueShopping = document.getElementById('continueShopping');
        const closeCompareModal = document.getElementById('closeCompareModal');
        const clearCompare = document.getElementById('clearCompare');
        
        if (closeModal) closeModal.addEventListener('click', () => this.hideModal());
        if (continueShopping) continueShopping.addEventListener('click', () => this.hideModal());
        if (closeCompareModal) closeCompareModal.addEventListener('click', () => this.hideCompareModal());
        if (clearCompare) clearCompare.addEventListener('click', () => this.clearCompare());
        
        // Settings Sidebar
        const closeSettings = document.getElementById('closeSettings');
        const settingsOverlay = document.getElementById('settingsOverlay');
        
        if (closeSettings) closeSettings.addEventListener('click', () => this.hideSettingsSidebar());
        if (settingsOverlay) settingsOverlay.addEventListener('click', () => this.hideSettingsSidebar());
    }

    applyFilters() {
        let filtered = [...this.products];

        // Filtro de búsqueda
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Filtro de categoría
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => 
                product.category === this.currentFilters.category
            );
        }

        // Filtro de precio
        filtered = filtered.filter(product => 
            product.price <= this.currentFilters.maxPrice
        );

        // Filtro de rating mínimo
        if (this.currentFilters.minRating && this.currentFilters.minRating > 0) {
            filtered = filtered.filter(product => 
                (product.rating?.rate || 0) >= this.currentFilters.minRating
            );
        }

        // Filtro de stock (simulado)
        if (this.currentFilters.stockOnly) {
            // Como FakeStore no tiene stock real, simulamos que todos están en stock
            // En una aplicación real, aquí filtrarías por stock > 0
        }

        // Ordenamiento
        if (this.currentFilters.sort) {
            switch (this.currentFilters.sort) {
                case 'price-asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    filtered.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name-desc':
                    filtered.sort((a, b) => b.title.localeCompare(a.title));
                    break;
            }
        }

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');

        if (!productsGrid) return;

        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = '';
            if (noProducts) noProducts.style.display = 'block';
            return;
        }

        if (noProducts) noProducts.style.display = 'none';
        productsGrid.innerHTML = this.filteredProducts.map(product => 
            this.createProductCard(product)
        ).join('');
    }

    createProductCard(product) {
        const isInCart = this.cart.some(item => item.id === product.id);
        const buttonClass = isInCart ? 'add-to-cart-btn added' : 'add-to-cart-btn';
        const buttonText = isInCart ? 'Agregado al carrito' : 'Agregar al carrito';

        // ========================================
        // FUNCIONALIDADES CONDICIONALES
        // ========================================
        
        let headerHTML = '';
        let viewedHTML = '';
        let stockHTML = '';
        let ratingHTML = '';

        // 1. HEADER CON BOTONES (favorites + compare)
        if (ACTIVATE_FEATURES.includes('favorites') || ACTIVATE_FEATURES.includes('compare')) {
            headerHTML = '<div class="product-header">';
            
            if (ACTIVATE_FEATURES.includes('favorites')) {
                const isFavorite = this.favorites && this.favorites.includes(product.id);
                const favoriteClass = isFavorite ? 'favorite-btn active' : 'favorite-btn';
                const favoriteIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
                headerHTML += `
                    <button class="${favoriteClass}" onclick="app.toggleFavorite(${product.id})" title="Agregar a favoritos">
                        <i class="${favoriteIcon}"></i>
                    </button>
                `;
            }
            
            if (ACTIVATE_FEATURES.includes('compare')) {
                const isInCompare = this.compareList && this.compareList.includes(product.id);
                const compareClass = isInCompare ? 'compare-btn active' : 'compare-btn';
                const compareText = isInCompare ? 'Quitar de comparar' : 'Comparar';
                headerHTML += `
                    <button class="${compareClass}" onclick="app.addToCompare(${product.id})" title="${compareText}">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                `;
            }
            
            headerHTML += '</div>';
        }

        // 2. INDICADOR DE PRODUCTO VISTO
        if (ACTIVATE_FEATURES.includes('viewed')) {
            const isViewed = this.viewedProducts && this.viewedProducts.includes(product.id);
            if (isViewed) {
                viewedHTML = '<div class="viewed-indicator"><i class="fas fa-eye"></i></div>';
            }
        }

        // 3. ESTADO DEL STOCK
        if (ACTIVATE_FEATURES.includes('stock')) {
            stockHTML = '<div class="stock-available">En stock</div>';
        }

        // 4. SISTEMA DE VALORACIONES
        if (ACTIVATE_FEATURES.includes('ratings')) {
            const averageRating = product.rating?.rate || 0;
            const ratingStars = this.createRatingStars(averageRating, product.id);
            ratingHTML = `
                <div class="product-rating">
                    <div class="rating-stars">${ratingStars}</div>
                    <span class="rating-count">(${product.rating?.count || 0} reseñas)</span>
                </div>
            `;
        }

        return `
            <div class="product-card" data-id="${product.id}">
                ${headerHTML}
                ${viewedHTML}
                
                <img src="${product.image}" alt="${product.title}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'"
                     ${ACTIVATE_FEATURES.includes('viewed') ? `onclick="app.trackProductView(${product.id})"` : ''}>
                
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-category">${product.category}</p>
                    ${stockHTML}
                    <p class="product-description">${product.description}</p>
                    ${ratingHTML}
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    
                    <button class="${buttonClass}" onclick="app.addToCart(${product.id})">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
    }

    populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(this.products.map(product => product.category))];
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }

    // ========================================
    // FUNCIONALIDADES DEL CARRITO (SIEMPRE ACTIVAS)
    // ========================================
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.renderProducts();
        
        // Mostrar feedback visual
        this.showAddToCartFeedback(productId);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.renderProducts();
    }

    updateCartQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.renderProducts();
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        this.showModal();
        this.clearCart();
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar) cartSidebar.classList.toggle('open');
        if (cartOverlay) cartOverlay.classList.toggle('active');
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const couponInput = document.getElementById('couponInput');
        const couponApplyBtn = document.getElementById('couponApplyBtn');
        const couponRemoveBtn = document.getElementById('couponRemoveBtn');
        const discountDisplay = document.getElementById('discountDisplay');

        if (!cartCount || !cartItems || !cartTotal) return;

        // Contador de items
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Items del carrito
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Tu carrito está vacío</p>';
        } else {
            cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
        }

        // Total del carrito
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Aplicar descuento si hay cupón activo
        let finalTotal = total;
        if (ACTIVATE_FEATURES.includes('coupons') && this.currentCoupon) {
            const discount = this.calculateDiscount();
            finalTotal = total - discount;
            
            if (discountDisplay) {
                discountDisplay.textContent = `-$${discount.toFixed(2)}`;
                discountDisplay.style.color = 'green';
            }
        } else if (discountDisplay) {
            discountDisplay.textContent = 'Ningún descuento aplicado';
            discountDisplay.style.color = 'inherit';
        }

        cartTotal.textContent = `$${finalTotal.toFixed(2)}`;

        // Habilitar/deshabilitar botones de cupón
        if (ACTIVATE_FEATURES.includes('coupons') && couponApplyBtn && couponRemoveBtn) {
            if (this.currentCoupon) {
                if (couponApplyBtn) couponApplyBtn.disabled = true;
                if (couponRemoveBtn) couponRemoveBtn.disabled = false;
                if (couponInput) couponInput.value = this.currentCoupon.code;
            } else {
                if (couponApplyBtn) couponApplyBtn.disabled = false;
                if (couponRemoveBtn) couponRemoveBtn.disabled = true;
                if (couponInput) couponInput.value = '';
            }
        }

        // Actualizar secciones adicionales
        this.updateFavoritesDisplay();
        this.updateViewedDisplay();
        this.updateCompareDisplay();
    }

    createCartItem(item) {
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="app.removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;
    }

    showAddToCartFeedback(productId) {
        const button = document.querySelector(`[data-id="${productId}"] .add-to-cart-btn`);
        if (button) {
            button.textContent = '¡Agregado!';
            button.classList.add('added');
            
            setTimeout(() => {
                button.textContent = 'Agregado al carrito';
            }, 1000);
        }
    }

    showModal() {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.add('show');
    }

    hideModal() {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.remove('show');
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const productsGrid = document.getElementById('productsGrid');
        
        if (loading && productsGrid) {
            if (show) {
                loading.style.display = 'block';
                productsGrid.style.display = 'none';
            } else {
                loading.style.display = 'none';
                productsGrid.style.display = 'grid';
            }
        }
    }

    showError(message) {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #ff4757;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    saveCartToStorage() {
        localStorage.setItem('fakeStoreCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('fakeStoreCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // ========================================
    // MÓDULOS DE FUNCIONALIDADES ADICIONALES
    // ========================================
    
    // MÓDULO 1: SISTEMA DE FAVORITOS
    setupFavoritesSystem() {
        // console.log('❤️ Sistema de favoritos activado');
    }
    
    toggleFavorite(productId) {
        if (!ACTIVATE_FEATURES.includes('favorites')) return;
        
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Producto removido de favoritos', 'info');
        } else {
            this.favorites.push(productId);
            this.showNotification('Producto agregado a favoritos', 'success');
        }
        this.saveFavoritesToStorage();
        this.renderProducts();
        
        // Actualizar también la vista del sidebar
        this.updateFavoritesDisplay();
    }
    
    saveFavoritesToStorage() {
        if (ACTIVATE_FEATURES.includes('favorites')) {
            localStorage.setItem('fakeStoreFavorites', JSON.stringify(this.favorites));
        }
    }
    
    loadFavoritesFromStorage() {
        if (ACTIVATE_FEATURES.includes('favorites')) {
            const saved = localStorage.getItem('fakeStoreFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    }
    
    // MÓDULO 2: HISTORIAL DE PRODUCTOS VISTOS
    setupProductViewTracking() {
        // console.log('👁️ Sistema de tracking de productos vistos activado');
    }
    
    trackProductView(productId) {
        if (!ACTIVATE_FEATURES.includes('viewed')) return;
        
        if (!this.viewedProducts.includes(productId)) {
            this.viewedProducts.unshift(productId);
            if (this.viewedProducts.length > 10) {
                this.viewedProducts.pop();
            }
            this.saveViewedProductsToStorage();
        }
    }
    
    saveViewedProductsToStorage() {
        if (ACTIVATE_FEATURES.includes('viewed')) {
            localStorage.setItem('fakeStoreViewed', JSON.stringify(this.viewedProducts));
        }
    }
    
    loadViewedProductsFromStorage() {
        if (ACTIVATE_FEATURES.includes('viewed')) {
            const saved = localStorage.getItem('fakeStoreViewed');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    }
    
    // MÓDULO 3: SISTEMA DE VALORACIONES
    setupRatingSystem() {
        // console.log('⭐ Sistema de valoraciones activado');
    }
    
    rateProduct(productId, rating) {
        if (!ACTIVATE_FEATURES.includes('ratings')) return;
        
        this.ratings[productId] = rating;
        this.saveRatingsToStorage();
        this.renderProducts();
    }
    
    saveRatingsToStorage() {
        if (ACTIVATE_FEATURES.includes('ratings')) {
            localStorage.setItem('fakeStoreRatings', JSON.stringify(this.ratings));
        }
    }
    
    loadRatingsFromStorage() {
        if (ACTIVATE_FEATURES.includes('ratings')) {
            const saved = localStorage.getItem('fakeStoreRatings');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    }
    
    createRatingStars(rating, productId) {
        if (!ACTIVATE_FEATURES.includes('ratings')) return '';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += `<i class="fas fa-star star-full" onclick="app.rateProduct(${productId}, ${i})"></i>`;
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHTML += `<i class="fas fa-star-half-alt star-half" onclick="app.rateProduct(${productId}, ${i})"></i>`;
            } else {
                starsHTML += `<i class="far fa-star star-empty" onclick="app.rateProduct(${productId}, ${i})"></i>`;
            }
        }
        
        return starsHTML;
    }
    
    // MÓDULO 4: COMPARADOR DE PRODUCTOS
    setupProductComparison() {
        // console.log('⚖️ Sistema de comparación de productos activado');
    }
    
    addToCompare(productId) {
        if (!ACTIVATE_FEATURES.includes('compare')) return;
        
        if (this.compareList.length < 3 && !this.compareList.includes(productId)) {
            this.compareList.push(productId);
            this.showCompareModal();
        }
    }
    
    showCompareModal() {
        if (ACTIVATE_FEATURES.includes('compare')) {
            // console.log('Productos a comparar:', this.compareList);
            this.showNotification(`Producto agregado a comparación. Total: ${this.compareList.length}/3`, 'info');
        }
    }
    
    // MÓDULO 5: SISTEMA DE CUPONES
    setupCouponSystem() {
        // console.log('🎫 Sistema de cupones activado');
        this.currentCoupon = null;
    }
    
    applyCoupon(code) {
        if (!ACTIVATE_FEATURES.includes('coupons')) return;
        
        const coupon = this.coupons.find(c => c.code === code.toUpperCase());
        if (coupon) {
            this.currentCoupon = coupon;
            this.updateCartDisplay();
            this.showNotification(`Cupón aplicado: ${coupon.code}`, 'success');
        } else {
            this.showNotification('Cupón inválido', 'error');
        }
    }
    
    removeCoupon() {
        if (!ACTIVATE_FEATURES.includes('coupons')) return;
        
        this.currentCoupon = null;
        this.updateCartDisplay();
        this.showNotification('Cupón removido', 'info');
    }
    
    calculateDiscount() {
        if (!ACTIVATE_FEATURES.includes('coupons') || !this.currentCoupon) return 0;
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (this.currentCoupon.type === 'percentage') {
            return (total * this.currentCoupon.discount) / 100;
        } else if (this.currentCoupon.type === 'shipping') {
            return Math.min(this.currentCoupon.discount, total);
        }
        
        return 0;
    }
    
    // MÓDULO 6: SISTEMA DE NOTIFICACIONES
    setupNotificationSystem() {
        // console.log('🔔 Sistema de notificaciones activado');
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        if (!ACTIVATE_FEATURES.includes('notifications')) {
            // console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, duration);
    }
    
    // ========================================
    // FUNCIONES PARA ACTUALIZAR VISTAS ADICIONALES
    // ========================================
    
    updateFavoritesDisplay() {
        if (!ACTIVATE_FEATURES.includes('favorites')) return;
        
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;
        
        if (!this.favorites || this.favorites.length === 0) {
            favoritesList.innerHTML = '<p class="empty-message">No tienes favoritos</p>';
            return;
        }
        
        const favoritesHTML = this.favorites.map(productId => {
            const product = this.products.find(p => p.id === productId);
            if (!product) return '';
            
            return `
                <div class="favorite-item">
                    <img src="${product.image}" alt="${product.title}" class="favorite-image">
                    <div class="favorite-info">
                        <div class="favorite-title">${product.title}</div>
                        <div class="favorite-price">$${product.price.toFixed(2)}</div>
                        <button class="remove-favorite" onclick="app.toggleFavorite(${product.id})">
                            <i class="fas fa-heart-broken"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        favoritesList.innerHTML = favoritesHTML;
    }
    
    updateViewedDisplay() {
        if (!ACTIVATE_FEATURES.includes('viewed')) return;
        
        const viewedList = document.getElementById('viewedList');
        if (!viewedList) return;
        
        if (!this.viewedProducts || this.viewedProducts.length === 0) {
            viewedList.innerHTML = '<p class="empty-message">No has visto productos</p>';
            return;
        }
        
        const viewedHTML = this.viewedProducts.map(productId => {
            const product = this.products.find(p => p.id === productId);
            if (!product) return '';
            
            return `
                <div class="viewed-item">
                    <img src="${product.image}" alt="${product.title}" class="viewed-image">
                    <div class="viewed-info">
                        <div class="viewed-title">${product.title}</div>
                        <div class="viewed-price">$${product.price.toFixed(2)}</div>
                        <button class="add-to-cart-small" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        viewedList.innerHTML = viewedHTML;
    }
    
    updateCompareDisplay() {
        if (!ACTIVATE_FEATURES.includes('compare')) return;
        
        const compareList = document.getElementById('compareList');
        const compareBtn = document.getElementById('compareBtn');
        if (!compareList || !compareBtn) return;
        
        if (!this.compareList || this.compareList.length === 0) {
            compareList.innerHTML = '<p class="empty-message">No hay productos para comparar</p>';
            compareBtn.disabled = true;
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Comparar (0/3)';
            return;
        }
        
        const compareHTML = this.compareList.map(productId => {
            const product = this.products.find(p => p.id === productId);
            if (!product) return '';
            
            return `
                <div class="compare-item">
                    <img src="${product.image}" alt="${product.title}" class="compare-image">
                    <div class="compare-info">
                        <div class="compare-title">${product.title}</div>
                        <div class="compare-price">$${product.price.toFixed(2)}</div>
                        <button class="remove-compare" onclick="app.removeFromCompare(${product.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        compareList.innerHTML = compareHTML;
        compareBtn.disabled = false;
        compareBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Comparar (${this.compareList.length}/3)`;
    }
    
    // ========================================
    // FUNCIONES DEL MODAL DE COMPARACIÓN
    // ========================================
    
    showCompareModal() {
        if (!ACTIVATE_FEATURES.includes('compare')) return;
        
        const modal = document.getElementById('compareModal');
        if (!modal) return;
        
        this.renderCompareModal();
        modal.classList.add('show');
    }
    
    hideCompareModal() {
        const modal = document.getElementById('compareModal');
        if (modal) modal.classList.remove('show');
    }
    
    renderCompareModal() {
        const compareProducts = document.getElementById('compareProducts');
        if (!compareProducts || !this.compareList || this.compareList.length === 0) return;
        
        const products = this.compareList.map(id => this.products.find(p => p.id === id)).filter(Boolean);
        
        if (products.length === 0) return;
        
        const compareHTML = `
            <div class="compare-table">
                <div class="compare-header">
                    <div class="compare-property">Propiedad</div>
                    ${products.map(product => `
                        <div class="compare-product-header">
                            <img src="${product.image}" alt="${product.title}" class="compare-modal-image">
                            <h4>${product.title}</h4>
                        </div>
                    `).join('')}
                </div>
                <div class="compare-row">
                    <div class="compare-property">Categoría</div>
                    ${products.map(product => `<div class="compare-value">${product.category}</div>`).join('')}
                </div>
                <div class="compare-row">
                    <div class="compare-property">Precio</div>
                    ${products.map(product => `<div class="compare-value">$${product.price.toFixed(2)}</div>`).join('')}
                </div>
                <div class="compare-row">
                    <div class="compare-property">Rating</div>
                    ${products.map(product => `<div class="compare-value">${product.rating?.rate || 0}/5 (${product.rating?.count || 0} reseñas)</div>`).join('')}
                </div>
                <div class="compare-row">
                    <div class="compare-property">Descripción</div>
                    ${products.map(product => `<div class="compare-value">${product.description.substring(0, 100)}...</div>`).join('')}
                </div>
            </div>
        `;
        
        compareProducts.innerHTML = compareHTML;
    }
    
    removeFromCompare(productId) {
        if (!ACTIVATE_FEATURES.includes('compare')) return;
        
        const index = this.compareList.indexOf(productId);
        if (index > -1) {
            this.compareList.splice(index, 1);
            this.updateCompareDisplay();
            this.showNotification('Producto removido de comparación', 'info');
        }
    }
    
    clearCompare() {
        if (!ACTIVATE_FEATURES.includes('compare')) return;
        
        this.compareList = [];
        this.updateCompareDisplay();
        this.hideCompareModal();
        this.showNotification('Comparación limpiada', 'info');
    }
    
    // ========================================
    // FUNCIÓN DEL MODO OSCURO
    // ========================================
    
    toggleDarkMode() {
        if (!ACTIVATE_FEATURES.includes('darkMode')) return;
        
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        const icon = document.querySelector('#darkModeToggle i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.saveDarkModePreference(isDark);
    }
    
    saveDarkModePreference(isDark) {
        if (!ACTIVATE_FEATURES.includes('darkMode')) return;
        localStorage.setItem('fakeStoreDarkMode', JSON.stringify(isDark));
    }
    
    loadDarkModePreference() {
        if (!ACTIVATE_FEATURES.includes('darkMode')) return;
        
        const saved = localStorage.getItem('fakeStoreDarkMode');
        if (saved) {
            const isDark = JSON.parse(saved);
            if (isDark) {
                document.body.classList.add('dark-mode');
                const icon = document.querySelector('#darkModeToggle i');
                if (icon) icon.className = 'fas fa-sun';
            }
        }
    }

    // ========================================
    // SISTEMA DE AUTENTICACIÓN
    // ========================================
    
    checkUserAuthentication() {
        const sessionData = this.getSessionData();
        
        if (sessionData && sessionData.user) {
            this.currentUser = sessionData.user;
            this.showUserSection();
        } else {
            this.hideUserSection();
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
    
    showUserSection() {
        const userSection = document.getElementById('userSection');
        const userName = document.getElementById('userName');
        
        if (userSection && userName && this.currentUser) {
            userSection.style.display = 'flex';
            userName.textContent = this.currentUser.name;
        }
    }
    
    hideUserSection() {
        const userSection = document.getElementById('userSection');
        if (userSection) {
            userSection.style.display = 'none';
        }
    }
}

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FakeStoreApp();
});

// Función global para manejar errores de imágenes
window.handleImageError = function(img) {
    img.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
};

// ========================================
// FUNCIONES GLOBALES DE AUTENTICACIÓN
// ========================================

// Función para cerrar sesión
function logout() {
    // Limpiar sesión
    localStorage.removeItem('fakeStoreSession');
    sessionStorage.removeItem('fakeStoreSession');
    
    // Mostrar notificación
    if (window.app && window.app.showNotification) {
        window.app.showNotification('Sesión cerrada exitosamente', 'info');
    }
    
    // Redirigir al login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Función para verificar si el usuario está autenticado
function isUserAuthenticated() {
    const localSession = localStorage.getItem('fakeStoreSession');
    const sessionSession = sessionStorage.getItem('fakeStoreSession');
    return !!(localSession || sessionSession);
}

// Función para obtener el usuario actual
function getCurrentUser() {
    const localSession = localStorage.getItem('fakeStoreSession');
    const sessionSession = sessionStorage.getItem('fakeStoreSession');
    
    if (localSession) {
        return JSON.parse(localSession).user;
    } else if (sessionSession) {
        return JSON.parse(sessionSession).user;
    }
    
    return null;
}
