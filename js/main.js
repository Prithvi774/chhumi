// ============================================
// CHHUMI WEBSITE - MAIN JAVASCRIPT
// Buddha-Inspired Spiritual E-commerce
// ============================================

// State Management
let configData = {};
let productsData = [];
let cart = [];
let currentFilter = 'all';

// ============================================
// 1. INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderSite();
    renderProducts();
    setupScrollEffects();
});

// ============================================
// 2. LOAD DATA
// ============================================
async function loadData() {
    try {
        const configRes = await fetch('data/config.json');
        configData = await configRes.json();
        
        const productsRes = await fetch('data/products.json');
        productsData = await productsRes.json();
        
        console.log('✅ Chhumi website loaded successfully');
    } catch (error) {
        console.error("❌ Error:", error);
        alert("⚠️ Make sure you're viewing this through GitHub Pages or a local server.");
    }
}

// ============================================
// 3. RENDER SITE
// ============================================
function renderSite() {
    // Apply Colors
    document.documentElement.style.setProperty('--primary', configData.theme.primaryColor);
    document.documentElement.style.setProperty('--accent', configData.theme.accentColor);
    document.documentElement.style.setProperty('--bg', configData.theme.bgColor);
    document.documentElement.style.setProperty('--text', configData.theme.textColor);

    // Content
    document.getElementById('hero-headline').textContent = configData.content.hero.headline;
    document.getElementById('hero-subtext').textContent = configData.content.hero.subtext;
    document.getElementById('hero-btn').textContent = configData.content.hero.buttonText;
    document.getElementById('hero-img').src = configData.content.hero.image;

    document.getElementById('about-title').textContent = configData.content.about.title;
    document.getElementById('about-text').textContent = configData.content.about.text;

    document.getElementById('origin-title').textContent = configData.content.origin.title;
    document.getElementById('origin-text').textContent = configData.content.origin.text;
    document.getElementById('origin-img').src = configData.content.origin.image;

    document.getElementById('footer-logo').textContent = configData.site.logoText;
    document.getElementById('footer-text').textContent = configData.content.footer.copyright;

    // Admin inputs
    document.getElementById('admin-site-name').value = configData.site.name;
    document.getElementById('admin-primary-color').value = configData.theme.primaryColor;
    document.getElementById('admin-accent-color').value = configData.theme.accentColor;
}

// ============================================
// 4. RENDER PRODUCTS
// ============================================
function renderProducts(filter = 'all') {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    const filtered = filter === 'all' 
        ? productsData 
        : productsData.filter(p => p.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products found.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.innerHTML = `
            <div class="product-img">
                ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <span class="product-price">$${product.price}</span>
                <button class="btn btn-primary btn-full" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        container.appendChild(card);
    });

    setTimeout(() => reveal(), 100);
}

// ============================================
// 5. FILTER PRODUCTS
// ============================================
function filterProducts(category) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
    
    renderProducts(category);
}

// ============================================
// 6. CART FUNCTIONS
// ============================================
function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
    toggleCart(true);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeFromCart(id);
        else updateCartUI();
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cart-total-price');

    const qty = cart.reduce((sum, item) => sum + item.qty, 0);
    count.textContent = qty;

    const price = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    total.textContent = `$${price.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <div class="quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <span class="remove-item" onclick="removeFromCart(${item.id})">&times;</span>
            </div>
        `).join('');
    }
}

function toggleCart(forceOpen = false) {
    const overlay = document.getElementById('cart-overlay');
    if (forceOpen) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.toggle('active');
        document.body.style.overflow = 'auto';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('Thank you for your interest! Checkout functionality coming soon. 🙏');
    }
}

// ============================================
// 7. MOBILE MENU
// ============================================
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// ============================================
// 8. ADMIN PANEL
// ============================================
function toggleAdmin() {
    document.getElementById('admin-panel').classList.toggle('active');
}

function updateConfig(path, value) {
    const keys = path.split('.');
    let obj = configData;
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    renderSite();
}

function updateTheme(key, value) {
    configData.theme[key] = value;
    const cssVar = key === 'primaryColor' ? 'primary' : 
                   key === 'accentColor' ? 'accent' : 
                   key === 'bgColor' ? 'bg' : 'text';
    document.documentElement.style.setProperty(`--${cssVar}`, value);
}

function addProduct() {
    try {
        const json = document.getElementById('new-product-json').value;
        const newProduct = JSON.parse(json);
        
        if (!newProduct.name || !newProduct.price) {
            throw new Error('Missing fields');
        }
        
        newProduct.id = productsData.length + 1;
        productsData.push(newProduct);
        renderProducts(currentFilter);
        
        alert('✅ Product added!');
        document.getElementById('new-product-json').value = '';
    } catch (e) {
        alert('❌ Invalid JSON');
    }
}

// ============================================
// 9. SCROLL EFFECTS
// ============================================
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(74, 68, 54, 0.05)';
        }
    });

    window.addEventListener('scroll', reveal);
    reveal();
}

function reveal() {
    const elements = document.querySelectorAll(".reveal");
    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 150) {
            el.classList.add("active");
        }
    });
}

// Close cart on outside click
document.getElementById('cart-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'cart-overlay') toggleCart();
});
