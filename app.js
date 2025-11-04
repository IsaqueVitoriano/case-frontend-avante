import * as cartLogic from './cartLogic.js';

document.addEventListener('DOMContentLoaded', () => {
    let products = [];
    let cart = [];

    const productListContainer = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const cartCountElement = document.getElementById('cart-count');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const modal = document.getElementById('order-modal');
    const newOrderBtn = document.getElementById('new-order-btn');
    const modalSummaryContainer = document.getElementById('modal-summary');
    const modalTotalPriceElement = document.getElementById('modal-total-price');

    const iconAddToCart = "./assets/images/icon-add-to-cart.svg";
    const iconIncrement = "./assets/images/icon-increment-quantity.svg";
    const iconDecrement = "./assets/images/icon-decrement-quantity.svg";
    const iconRemove = "./assets/images/icon-remove-item.svg";

    async function initializeApp() {
        try {
        
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`Erro ao buscar data.json: ${response.statusText}`);
            }

            products = await response.json();
            renderUI();

        } catch (error) {

            console.error("Não foi possível carregar os produtos:", error);
            productListContainer.innerHTML = "<p>Erro ao carregar produtos. Tente recarregar a página.</p>";
        
        }
    }

    function renderUI() {

        renderProducts();
        renderCart();
    
    }

    function renderProducts() {

        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productInCart = cart.find(item => item.name === product.name);
            const isInCart = productInCart !== undefined;

            const productCard = document.createElement('article');
            productCard.className = 'product-card';
            productCard.setAttribute('data-in-cart', isInCart);
            
            productCard.innerHTML = `
                <div class="product-image-container">
                    <picture>
                        <source srcset="${product.image.desktop}" media="(min-width: 1024px)">
                        <source srcset="${product.image.tablet}" media="(min-width: 768px)">
                        <img src="${product.image.mobile}" alt="${product.name}" class="product-image">
                    </picture>
                    <button class="add-to-cart-btn" data-name="${product.name}">
                        <img src="${iconAddToCart}" alt="Add to cart icon">
                        Add to Cart
                    </button>
                    <div class="in-cart-btn">
                        <button class="decrement-btn" data-name="${product.name}"><img src="${iconDecrement}" alt="Diminuir"></button>
                        <span>${productInCart ? productInCart.quantity : 0}</span>
                        <button class="increment-btn" data-name="${product.name}"><img src="${iconIncrement}" alt="Aumentar"></button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
            `;

            productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                cart = cartLogic.addToCart(cart, products, product.name);
                renderUI();

            });

            productCard.querySelector('.increment-btn').addEventListener('click', () => {
                cart = cartLogic.incrementQuantity(cart, product.name);
                renderUI();
            
            });
            productCard.querySelector('.decrement-btn').addEventListener('click', () => {
                cart = cartLogic.decrementQuantity(cart, product.name);
                renderUI();
            
            });

            productListContainer.appendChild(productCard);
        
        });
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        const totalItems = cartLogic.getCartTotalItems(cart);
        const totalPrice = cartLogic.calculateTotal(cart);

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartSummary.style.display = 'none';
        } else {
            cartEmpty.style.display = 'none';
            cartSummary.style.display = 'block';
            cart.forEach(item => {
                const itemTotalPrice = item.price * item.quantity;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-details">
                            <span class="cart-item-quantity">${item.quantity}x</span>
                            <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
                            <span class="cart-item-total-price">$${itemTotalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-name="${item.name}" aria-label="Remove ${item.name}">
                        <img src="${iconRemove}" alt="Remover">
                    </button>
                `;
                cartItem.querySelector('.remove-item-btn').addEventListener('click', () => {
                    cart = cartLogic.removeFromCart(cart, item.name);
                    renderUI();
        
                });
        
                cartItemsContainer.appendChild(cartItem);
        
            });
        }
        
        cartTotalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        cartCountElement.textContent = totalItems;
    }

    function showModal() {
        if (cart.length === 0) return;
        
        modalSummaryContainer.innerHTML = '';
        const totalPrice = cartLogic.calculateTotal(cart);
        cart.forEach(item => {
            const itemTotalPrice = item.price * item.quantity;
            modalSummaryContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image.thumbnail}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 4px;">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-details">
                            <span class="cart-item-quantity">${item.quantity}x</span>
                            <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <span class="cart-item-total-price">$${itemTotalPrice.toFixed(2)}</span>
                </div>
            `;
        
        });
        
        modalTotalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        modal.style.display = 'flex';
    }

    function startNewOrder() {
        cart = [];
        modal.style.display = 'none';
        renderUI();
    }

    confirmOrderBtn.addEventListener('click', showModal);
    newOrderBtn.addEventListener('click', startNewOrder);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { /* Não fecha ao clicar fora */ }
    });

    initializeApp();
});