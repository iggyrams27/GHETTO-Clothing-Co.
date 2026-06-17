// Product Data
const products = [
    {
        id: 1,
        name: "Classic Black Tee",
        category: "tees",
        price: 29.99,
        emoji: "👕"
    },
    {
        id: 2,
        name: "Red Logo Hoodie",
        category: "hoodies",
        price: 79.99,
        emoji: "🧥"
    },
    {
        id: 3,
        name: "Cargo Pants",
        category: "pants",
        price: 89.99,
        emoji: "👖"
    },
    {
        id: 4,
        name: "Street Cap",
        category: "accessories",
        price: 24.99,
        emoji: "🧢"
    },
    {
        id: 5,
        name: "Oversized Graphic Tee",
        category: "tees",
        price: 34.99,
        emoji: "👕"
    },
    {
        id: 6,
        name: "Premium Hoodie",
        category: "hoodies",
        price: 84.99,
        emoji: "🧥"
    },
    {
        id: 7,
        name: "Black Joggers",
        category: "pants",
        price: 59.99,
        emoji: "👖"
    },
    {
        id: 8,
        name: "Logo Backpack",
        category: "accessories",
        price: 49.99,
        emoji: "🎒"
    }
];

// Cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartModal = document.getElementById('cartModal');
const closeBtn = document.querySelector('.close');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
    setupEventListeners();
    loadCartFromStorage();
    updateCartCount();
});

// Display Products
function displayProducts(category) {
    let filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="product-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Filter Products
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        displayProducts(btn.getAttribute('data-filter'));
    });
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToStorage();
    updateCartCount();
    showCartNotification();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    displayCart();
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Display Cart
function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '0';
        return;
    }

    let total = 0;
    cartItemsDiv.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div>
                    <p style="font-weight: bold; margin-bottom: 0.5rem;">$${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart(${item.id})" style="background-color: #ff0000; color: white; border: none; padding: 0.4rem 0.8rem; cursor: pointer; font-size: 0.8rem;">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Show Cart Notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #00ff00;
        color: #000;
        padding: 1rem;
        border-radius: 4px;
        z-index: 999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = 'Item added to cart! ✓';
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart Modal
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        displayCart();
        cartModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter Form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing! Check your email for updates.');
            newsletterForm.reset();
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#cart') {
                return; // Let cart icon handle its own click
            }
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Mobile Menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'var(--primary)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.gap = '1rem';
                navLinks.style.padding = '1rem';
            }
        });
    }
}

// Local Storage
function saveCartToStorage() {
    localStorage.setItem('ghetto_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('ghetto_cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

// Smooth animations on scroll
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

document.querySelectorAll('.product-card, .lookbook-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});