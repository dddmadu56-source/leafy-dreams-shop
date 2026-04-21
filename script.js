// ── Default Products (used if admin hasn't customized yet) ──
const DEFAULT_PRODUCTS = [
    { id: 1, name: "Classic Juniper Bonsai - 5 Year Mature Tree", category: "bonsai", image: "assets/images/WhatsApp Image 2026-03-09 at 12.32.57.jpeg", details: "Hand-crafted mature Juniper with elegant twisting branches. Perfect for indoor zen spaces.", rating: "4.9", sold: "128 Sold" },
    { id: 2, name: "Zen Garden Table Pot - Halloween Edition", category: "succulents-cactus", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.00.jpeg", details: "Vibrant orange ceramic pot with festive hand-painted pumpkin design. Includes succulent.", rating: "4.8", sold: "85 Sold" },
    { id: 3, name: "Emerald Cascade Dwarf Bonsai Tree", category: "bonsai", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.01.jpeg", details: "Lush green foliage cascading from a rustic clay pot. High drought resistance.", rating: "5.0", sold: "42 Sold" },
    { id: 4, name: "Minimalist Aura Ceramic Table Pot", category: "desk-plants", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.02.jpeg", details: "Sleek matte finish geometric pot. Ideal for succulents and small indoor plants.", rating: "4.7", sold: "210 Sold" },
    { id: 5, name: "Desert Rose Bonsai - Rare Pink Bloom", category: "bonsai", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.03.jpeg", details: "Unique thick trunk with beautiful pink seasonal flowers. Low maintenance.", rating: "4.9", sold: "67 Sold" },
    { id: 6, name: "Marble Elegance Artisan Table Pot", category: "desk-plants", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.04.jpeg", details: "Premium marble texture finish. Adds a touch of luxury to your work desk.", rating: "4.8", sold: "154 Sold" },
    { id: 7, name: "Sacred Spirit Ficus Bonsai Tree", category: "bonsai", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.05.jpeg", details: "Classic Ficus with aerial roots. Symbolic of peace and longevity.", rating: "5.0", sold: "31 Sold" },
    { id: 8, name: "Terracotta Soul Traditional Pot", category: "hand-painted-pots", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.06 (2).jpeg", details: "Natural porous clay pot. Excellent for healthy root growth and artistic Bonsai training.", rating: "4.6", sold: "320 Sold" },
    { id: 10, name: "Geometric Harmony Modern Pot Set", category: "hand-painted-pots", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.09.jpeg", details: "Set of designer pots with modern geometric patterns. Durable finish.", rating: "4.7", sold: "94 Sold" },
    { id: 11, name: "Succulent Symphony Desktop Collection", category: "succulents-cactus", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.27.jpeg", details: "A miniature forest of rare succulents. A masterpiece for any desktop sanctuary.", rating: "4.8", sold: "205 Sold" },
    { id: 12, name: "Palm Serenity Indoor Atmosphere Set", category: "air-purifying", image: "assets/images/WhatsApp Image 2026-03-09 at 12.33.28.jpeg", details: "Tall indoor plant in a contemporary pot. Purifies indoor air and elevates the room energy.", rating: "4.9", sold: "56 Sold" }
];

// ── Load from Firebase (fallback to defaults if empty) ──
let products = [...DEFAULT_PRODUCTS];

// State Management
let currentFilter = 'all';
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isDarkMode = localStorage.getItem('darkMode') === null ? true : localStorage.getItem('darkMode') === 'true';

const testimonials = [
    { name: "Anura P.", text: "The Bonsai I received was even more beautiful than the pictures. Highly recommended!" },
    { name: "Nimmi S.", text: "Beautiful table pots! They added so much life to my home office." },
    { name: "Kasun T.", text: "Great service and healthy plants. The care guide was really helpful." }
];

const quizSteps = [
    {
        q: "Where will your new leafy friend live?",
        options: [
            { t: "Bright Sunlit Window", score: "bonsai" },
            { t: "Indoor Office Desk", score: "table-pot" }
        ]
    },
    {
        q: "How much time do you have for plant care?",
        options: [
            { t: "I'm a dedicated gardener", score: "bonsai" },
            { t: "Set it and forget it (mostly)", score: "table-pot" }
        ]
    }
];

let currentQuizStep = 0;
let quizScores = { bonsai: 0, "table-pot": 0 };

const productGrid = document.getElementById('productGrid');
const whatsappNumber = "94763428225";

function playSound() { /* Sound disabled */ }

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-out-quad' });
    initTheme();
    updateWishCount();
    updateCartCount();
    setupFeedback();
    setupCursorGlow();
    setupSidebarScrollSpy();
    setupListeners();
    setupTestimonials();
    initParticles();
    initTrustNotifications();
    lucide.createIcons();

    // 🔥 Load products from Firebase
    db.ref('products').once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            products = Object.values(data).sort((a, b) => a.id - b.id);
        } else {
            // First time: push defaults to Firebase
            const obj = {};
            DEFAULT_PRODUCTS.forEach((p, i) => { obj[i] = p; });
            db.ref('products').set(obj);
        }
        renderProducts();
    }).catch(() => {
        // Firebase unreachable → use defaults
        renderProducts();
    });
});

function setupListeners() {
    document.getElementById('productSearch').addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });

    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

    // Mobile Sidebar Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close sidebar when clicking links on mobile
    document.querySelectorAll('.sidebar-nav a, .side-cat-item').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileMenuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    });
}

// Theme Logic
function initTheme() {
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDarkMode);
    playSound();
}

// Product Rendering
function renderProducts(filter = 'all', query = '') {
    productGrid.innerHTML = '';
    currentFilter = filter;

    let displayProducts;
    if (filter === 'wishlist') {
        displayProducts = products.filter(p => wishlist.includes(p.id));
    } else {
        displayProducts = filter === 'all'
            ? products
            : products.filter(p => p.category === filter);
    }

    if (query) {
        displayProducts = displayProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.details.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (displayProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No botanical treasures found matching your search...</p>';
        return;
    }

    displayProducts.forEach((product, index) => {
        const isWish = wishlist.includes(product.id);
        const inCart = cart.some(item => item.id === product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index % 4) * 50);

        card.innerHTML = `
            <button class="wishlist-btn ${isWish ? 'active' : ''}" onclick="toggleWishlist(${product.id}, event)" data-tooltip="${isWish ? 'Wishlisted ❤️' : 'Add to Wishlist'}">
                <i data-lucide="heart"></i>
            </button>
            <div class="product-image" onclick="openModal(${product.id})">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category.replace('-', ' ')}</span>
                <h3>${product.name}</h3>
                <div class="product-meta">
                    <span class="product-rating"><i data-lucide="heart"></i> ${product.rating}</span>
                    <span class="product-sold"><i data-lucide="shopping-bag"></i> ${product.sold}</span>
                </div>
                <div class="product-actions" style="display:flex; gap:10px; overflow:visible;">
                    <button class="btn-whatsapp" onclick="openModal(${product.id})" style="flex:1;" data-tooltip="See More">
                        <i data-lucide="eye"></i>
                    </button>
                    <button class="btn-whatsapp ${inCart ? 'active' : ''}" onclick="toggleCart(${product.id}, event)" style="flex:1; background:${inCart ? 'var(--primary-light)' : ''}" data-tooltip="${inCart ? 'Remove' : 'Add to Cart'}">
                        <i data-lucide="${inCart ? 'check' : 'shopping-cart'}"></i>
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
    lucide.createIcons();
}

function searchProducts(query) {
    renderProducts(currentFilter, query);
}

function filterCategory(category) {
    // Sync Sidebar
    document.querySelectorAll('.side-cat-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    // Sync Collection Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    // Flash the product grid before render
    const grid = document.getElementById('productGrid');
    if (grid) {
        grid.style.transition = 'opacity 0.15s ease';
        grid.style.opacity = '0.3';
    }

    renderProducts(category);

    // Scroll to shop section after a tiny delay (let DOM update first)
    setTimeout(() => {
        const shopSection = document.getElementById('shop');
        if (shopSection) {
            const offsetTop = shopSection.getBoundingClientRect().top + window.pageYOffset - 20;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        // Restore grid opacity
        if (grid) grid.style.opacity = '1';
    }, 50);
}

// Wishlist Logic
function toggleWishlist(id, e) {
    e.stopPropagation();
    playSound();
    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishCount();
    renderProducts(currentFilter, document.getElementById('productSearch').value);
}

function updateWishCount() {
    document.getElementById('wishCount').innerText = wishlist.length;
}

function showWishlist() {
    renderProducts('wishlist');
}

// Modal Logic
function openModal(id) {
    playSound();
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('modalBody');

    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I want to inquire about "' + product.name + '"')}`;

    body.innerHTML = `
        <div class="quick-view-grid">
            <div class="modal-left">
                <img src="${product.image}" class="modal-image">
            </div>
            <div class="modal-info">
                <span class="product-category">${product.category}</span>
                <h2>${product.name}</h2>
                <div class="modal-meta">
                    <span>⭐ ${product.rating} Rating</span>
                    <span>📦 ${product.sold}</span>
                </div>
                <p class="product-details">${product.details}</p>
                <div class="modal-care-brief">
                    <strong>🌿 Care Level:</strong> ${product.category === 'bonsai' ? 'Advanced' : 'Easy'}<br>
                    <strong>💧 Water:</strong> ${product.category === 'bonsai' ? 'Daily check' : 'Weekly'}<br>
                    <strong>☀️ Light:</strong> Bright Indirect
                </div>
                <a href="${waLink}" target="_blank" class="btn-submit" style="text-decoration:none">
                    Chat on WhatsApp <i data-lucide="phone-call"></i>
                </a>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('quickViewModal').style.display = 'none';
}

// Testimonials — loads default + saved visitor reviews
function setupTestimonials() {
    const slider = document.getElementById('testimonialSlider');
    const dots = document.getElementById('sliderDots');

    // Merge default + saved visitor reviews
    const savedReviews = JSON.parse(localStorage.getItem('leafyReviews')) || [];
    const allTestimonials = [...testimonials, ...savedReviews];

    allTestimonials.forEach((t, i) => {
        const slide = document.createElement('div');
        slide.className = `testimonial-slide ${i === 0 ? 'active' : ''}`;
        slide.innerHTML = `<p>"${t.text}"</p><div class="testimonial-author">- ${t.name}</div>`;
        slider.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => showSlide(i);
        dots.appendChild(dot);
    });

    let current = 0;
    const total = allTestimonials.length;
    setInterval(() => {
        current = (current + 1) % total;
        showSlide(current);
    }, 5000);
}

function showSlide(index) {
    document.querySelectorAll('.testimonial-slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.testimonial-slide')[index].classList.add('active');
    document.querySelectorAll('.dot')[index].classList.add('active');
}

// Care Guide
function toggleCare(el) {
    el.classList.toggle('active');
}

// Quiz Logic
function startQuiz() {
    playSound();
    currentQuizStep = 0;
    quizScores = { bonsai: 0, "table-pot": 0 };
    document.getElementById('quizModal').style.display = 'flex';
    showQuizStep();
}

function showQuizStep() {
    const body = document.getElementById('quizBody');
    const step = quizSteps[currentQuizStep];

    if (!step) {
        showQuizResult();
        return;
    }

    body.innerHTML = `
        <div class="quiz-question">
            <h2>Question ${currentQuizStep + 1}</h2>
            <p>${step.q}</p>
            <div class="quiz-options">
                ${step.options.map(o => `<div class="quiz-opt" onclick="handleQuizAnswer('${o.score}')">${o.t}</div>`).join('')}
            </div>
        </div>
    `;
}

function handleQuizAnswer(score) {
    playSound();
    quizScores[score]++;
    currentQuizStep++;
    showQuizStep();
}

function showQuizResult() {
    const winner = quizScores.bonsai >= quizScores["table-pot"] ? "bonsai" : "table-pot";
    const body = document.getElementById('quizBody');
    body.innerHTML = `
        <div class="quiz-question">
            <h2>Matches Found! ✨</h2>
            <p>Based on your lifestyle, we recommend exploring our <strong>${winner === 'bonsai' ? 'Bonsai Art' : 'Table Pots'}</strong> collection.</p>
            <button class="btn-quiz" onclick="closeQuiz(); filterCategory('${winner}')">See Recommendations</button>
        </div>
    `;
}

function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
}

// General Utilities (sound removed)

function setupCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Background Glow
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';

        // Custom Cursor (Centered)
        if (cursor) {
            cursor.style.left = (x - 12) + "px";
            cursor.style.top = (y - 12) + "px";
        }
    });

    // Hover effects for the leaf cursor
    document.querySelectorAll('a, button, .product-card, .care-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.transform = 'scale(1)';
        });
    });
}

function setupFeedback() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('custName').value.trim();
        const message = document.getElementById('custMessage').value.trim();
        if (!name || !message) return;

        // ── Save review to localStorage so it shows in testimonials ──
        const savedReviews = JSON.parse(localStorage.getItem('leafyReviews')) || [];
        savedReviews.push({ name, text: message });
        localStorage.setItem('leafyReviews', JSON.stringify(savedReviews));

        // ── Add to slider immediately (no page reload needed) ──
        const slider = document.getElementById('testimonialSlider');
        const dots = document.getElementById('sliderDots');
        const allSlides = document.querySelectorAll('.testimonial-slide');
        const newIndex = allSlides.length;

        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `<p>"${message}"</p><div class="testimonial-author">- ${name}</div>`;
        slider.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.onclick = () => showSlide(newIndex);
        dots.appendChild(dot);

        // Show the new review immediately
        showSlide(newIndex);

        // ── Also send to WhatsApp ──
        const feedbackText = `🌟 NEW CUSTOMER FEEDBACK 🌟\n\nFrom: ${name}\nMessage: ${message}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(feedbackText)}`, '_blank');

        feedbackForm.reset();

        // Show a thank-you message briefly
        showThankyou();
    });
}

function showThankyou() {
    const btn = document.querySelector('#feedbackForm .btn-submit');
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✅ Thank you! Review saved!';
    btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        lucide.createIcons();
    }, 3000);
}

// Cart Functionality
function toggleCart(id, e) {
    if (e) e.stopPropagation();
    playSound();
    const product = products.find(p => p.id === id);
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart.splice(existingIndex, 1);
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderProducts(currentFilter, document.getElementById('productSearch').value);
}

function updateCartCount() {
    scrollTo(0, pageYOffset); // Trigger refresh
    document.getElementById('cartCount').innerText = cart.length;
}

function toggleCartModal() {
    playSound();
    const modal = document.getElementById('cartModal');
    const isVisible = modal.style.display === 'flex';
    modal.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) renderCartItems();
}

function renderCartItems() {
    const body = document.getElementById('cartBody');
    if (cart.length === 0) {
        body.innerHTML = '<p style="text-align:center; padding:2rem;">Your selection is empty.</p>';
        return;
    }

    body.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${item.category}</span>
            </div>
            <button class="cart-item-remove" onclick="toggleCart(${item.id})">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

function sendBulkInquiry() {
    if (cart.length === 0) return;
    const itemsList = cart.map(item => `- ${item.name}`).join('%0A');
    const text = `Hi Leafy Dreams! 🌿%0A%0AI am interested in the following selections:%0A%0A${itemsList}%0A%0APlease let me know the availability!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
}

// Trust Notifications
const trustMessages = [
    { msg: "Someone from Colombo just viewed a Bonsai Art", icon: "eye" },
    { msg: "New feedback received! ⭐⭐⭐⭐⭐", icon: "message-square" },
    { msg: "5 people are looking at Table Pots right now", icon: "users" },
    { msg: "Order inquiry sent from Kandy!", icon: "send" }
];

function initTrustNotifications() {
    setInterval(() => {
        const random = trustMessages[Math.floor(Math.random() * trustMessages.length)];
        showTrustNotification(random.msg, random.icon);
    }, 15000);
}

function showTrustNotification(msg, icon) {
    const container = document.getElementById('trustNotification');
    container.innerHTML = `<i data-lucide="${icon}"></i> <span>${msg}</span>`;
    container.classList.add('show');
    lucide.createIcons();
    setTimeout(() => container.classList.remove('show'), 5000);
}

// Particle System
let particles = [];
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            angle: Math.random() * 360
        });
    }
    animateParticles();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillStyle = isDarkMode ? 'rgba(158, 216, 255, 0.2)' : 'rgba(45, 90, 39, 0.1)';

        // Draw simple leaf shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(p.size, -p.size, p.size * 2, 0);
        ctx.quadraticCurveTo(p.size, p.size, 0, 0);
        ctx.fill();
        ctx.restore();

        p.angle += 0.2;
    });
    requestAnimationFrame(animateParticles);
}

function setupSidebarScrollSpy() {
    const sections = document.querySelectorAll('section, header.top-header');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 150) {
                current = section.getAttribute('id');
                if (!current && section.classList.contains('top-header')) current = 'home';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });

        // Sync Mobile Bottom Nav
        const mobileLinks = document.querySelectorAll('.mobile-bottom-nav .nav-item');
        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });
}

