export function addToCart(cart, products, productName) {
    const productToAdd = products.find(p => p.name === productName);
    return [...cart, { ...productToAdd, quantity: 1 }];
}

export function incrementQuantity(cart, productName) {
    return cart.map(item =>
        item.name === productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
    );
}

export function removeFromCart(cart, productName) {
    return cart.filter(item => item.name !== productName);
}

export function decrementQuantity(cart, productName) {
    const itemInCart = cart.find(item => item.name === productName);
    if (itemInCart && itemInCart.quantity === 1) {
        return removeFromCart(cart, productName);
    }
    return cart.map(item =>
        item.name === productName
            ? { ...item, quantity: item.quantity - 1 }
            : item
    );
}

export function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartTotalItems(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
}