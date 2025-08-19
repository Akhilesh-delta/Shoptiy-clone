// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const cartBtn = document.querySelector('.cart-btn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.querySelector('.close-cart');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Sample product data with more details
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'electronics',
        description: 'Experience crystal clear sound with these premium wireless headphones. Features noise cancellation, 30-hour battery life, and comfortable over-ear design.',
        rating: 4.5,
        reviews: 128,
        inStock: true
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'electronics',
        description: 'Stay connected with this feature-packed smartwatch. Tracks your fitness, heart rate, sleep, and delivers notifications from your smartphone.',
        rating: 4.8,
        reviews: 256,
        inStock: true
    },
    {
        id: 3,
        name: 'Running Shoes',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'fashion',
        description: 'Lightweight and comfortable running shoes with excellent cushioning and support for all types of runners. Perfect for both training and racing.',
        rating: 4.7,
        reviews: 189,
        inStock: true
    },
    {
        id: 4,
        name: 'Bluetooth Speaker',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'electronics',
        description: 'Portable Bluetooth speaker with 20-hour battery life, waterproof design, and powerful 20W sound. Perfect for outdoor adventures and home use.',
        rating: 4.6,
        reviews: 312,
        inStock: true
    },
    {
        id: 5,
        name: 'Leather Backpack',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'fashion',
        description: 'Stylish and durable leather backpack with multiple compartments, laptop sleeve, and USB charging port. Perfect for work, travel, and everyday use.',
        rating: 4.9,
        reviews: 178,
        inStock: true
    },
    {
        id: 6,
        name: 'Smartphone Stand',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'accessories',
        description: 'Adjustable smartphone stand with 360° rotation and foldable design. Compatible with all smartphones and tablets. Perfect for watching videos and video calls.',
        rating: 4.3,
        reviews: 92,
        inStock: true
    },
    {
        id: 7,
        name: 'Wireless Earbuds',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'electronics',
        description: 'True wireless earbuds with active noise cancellation, 8-hour battery life, and water resistance. Includes charging case for 24+ hours of total playtime.',
        rating: 4.7,
        reviews: 421,
        inStock: true
    },
    {
        id: 8,
        name: 'Fitness Tracker',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1576243345690-4e4b79a63256?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'fitness',
        description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and 14-day battery life. Tracks steps, calories, and various workout modes.',
        rating: 4.5,
        reviews: 203,
        inStock: true
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    displayProducts(products);
    updateCartCount();
    setupEventListeners();
    
    // Initialize search and filter
    setupSearch();
    setupCategoryFilters();
}

// Display products on the page with filtering
function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products found. Try adjusting your search or filters.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');
        productElement.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-actions">
                    <button class="quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
                    <button class="add-to-wishlist" data-id="${product.id}"><i class="far fa-heart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${renderRatingStars(product.rating)}
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productElement);
    });

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    e.stopPropagation(); // Prevent event bubbling
    
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Only include necessary product data in the cart
        const { id, name, price, image } = product;
        cart.push({
            id, name, price, image,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Update cart in the UI and localStorage
function updateCart() {
    updateCartCount();
    updateCartSidebar();
    saveCart();
}

// Update cart count in the header
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Update cart sidebar
function updateCartSidebar() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}">Remove</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to quantity controls and remove buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Handle quantity changes
function handleQuantityChange(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    if (e.target.classList.contains('plus')) {
        item.quantity += 1;
    } else if (e.target.classList.contains('minus')) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // If quantity is 1 and minus is clicked, remove the item
            cart = cart.filter(item => item.id !== productId);
        }
    }
    
    updateCart();
    
    // Show notification for the action
    if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
        showNotification(`Updated ${item.name} quantity`);
    }
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification(`${item.name} removed from cart`);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add styles for the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Render rating stars
function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayProducts(products);
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displayProducts(filteredProducts);
    });
}

// Setup category filters
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(
                    product => product.category === category
                );
                displayProducts(filteredProducts);
            }
        });
    });
}

// Show product detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Update product detail content
    document.getElementById('detailImage').src = product.image;
    document.getElementById('detailTitle').textContent = product.name;
    document.getElementById('detailPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('detailDescription').textContent = product.description;
    document.getElementById('detailCategory').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    
    // Update rating
    const ratingContainer = document.querySelector('.product-rating .stars');
    if (ratingContainer) {
        ratingContainer.innerHTML = renderRatingStars(product.rating) + 
            `<span class="review-count">(${product.reviews} reviews)</span>`;
    }
    
    // Show the product detail modal
    document.getElementById('productDetail').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Toggle cart sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart sidebar
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close cart when clicking on overlay
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        document.getElementById('productDetail').classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close product detail
    document.querySelector('.close-detail')?.addEventListener('click', () => {
        document.getElementById('productDetail').classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Delegate events for dynamic elements
    document.addEventListener('click', (e) => {
        // Quick view button
        if (e.target.closest('.quick-view')) {
            const productId = parseInt(e.target.closest('.quick-view').dataset.id);
            showProductDetail(productId);
            overlay.classList.add('active');
        }
        
        // Add to wishlist
        if (e.target.closest('.add-to-wishlist')) {
            const productId = parseInt(e.target.closest('.add-to-wishlist').dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                showNotification(`Added ${product.name} to wishlist`);
                // Here you would typically add to a wishlist array
            }
        }
        
        // Add to cart from detail page
        if (e.target.closest('.add-to-cart-detail')) {
            const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
            const productId = parseInt(document.querySelector('.product-detail').dataset.productId);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        ...product,
                        quantity: quantity
                    });
                }
                
                updateCart();
                showNotification(`${quantity} ${product.name}(s) added to cart!`);
            }
        }
        
        // Quantity controls in detail page
        if (e.target.closest('.quantity-btn')) {
            const input = document.querySelector('.quantity-input');
            let value = parseInt(input.value) || 1;
            
            if (e.target.classList.contains('plus')) {
                value++;
            } else if (e.target.classList.contains('minus') && value > 1) {
                value--;
            }
            
            input.value = value;
        }
    });
    
    // Close cart when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add animation keyframes for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
