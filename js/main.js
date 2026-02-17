// State
let cart = [];
const products = [
    { id: 1, name: "The Classic Bodhichitta", price: 145, image: "https://images.unsplash.com/photo-1605218427306-633ba88c9735?q=80&w=800" },
    { id: 2, name: "Earth & Gold Mala", price: 165, image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800" },
    { id: 3, name: "The Meditation Wrap", price: 120, image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=800" }
];

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';
}

// Cart Functions
function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('active');
    document.getElementById('cartDrawer').classList.toggle('active');
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCart();
    toggleCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    cartCount.textContent = totalQty;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
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
                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `).join('');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
    } else {
        alert('Thank you for your order! Checkout functionality coming soon.');
    }
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.product-card, .intro-content, .origin-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});

console.log('%c🌿 Chhumi - Sacred Meditation Tools', 'color: #C9B99A; font-size: 16px; font-weight: bold;');
