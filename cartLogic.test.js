import * as logic from './cartLogic.js';

const mockProducts = [
    { "name": "Waffle with Berries", "category": "Waffle", "price": 6.50 },
    { "name": "Vanilla Bean Crème Brûlée", "category": "Crème Brûlée", "price": 7.00 },
    { "name": "Macaron Mix of Five", "category": "Macaron", "price": 8.00 }
];

describe('Testes da Lógica do Carrinho', () => {
    let cart;
    beforeEach(() => {
        cart = [];
    });

    test('Deve adicionar um item ao carrinho', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        expect(cart.length).toBe(1);
        expect(cart[0].name).toBe('Waffle with Berries');
        expect(cart[0].quantity).toBe(1);
    });

    test('Deve incrementar a quantidade de um item', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        cart = logic.incrementQuantity(cart, 'Waffle with Berries');
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(2);
    });

    test('Deve decrementar a quantidade de um item', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        cart = logic.incrementQuantity(cart, 'Waffle with Berries');
        cart = logic.decrementQuantity(cart, 'Waffle with Berries');
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(1);
    });

    test('Deve remover um item se a quantidade for 1 e for decrementado', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        cart = logic.decrementQuantity(cart, 'Waffle with Berries');
        expect(cart.length).toBe(0);
    });

    test('Deve remover um item diretamente', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        cart = logic.addToCart(cart, mockProducts, 'Macaron Mix of Five');
        cart = logic.removeFromCart(cart, 'Waffle with Berries');
        expect(cart.length).toBe(1);
        expect(cart[0].name).toBe('Macaron Mix of Five');
    });

    test('Deve calcular o total do carrinho corretamente', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        cart = logic.addToCart(cart, mockProducts, 'Macaron Mix of Five'); 
        cart = logic.incrementQuantity(cart, 'Macaron Mix of Five');
        const total = logic.calculateTotal(cart);
        expect(total).toBe(22.50);
    });

    test('Deve calcular o número total de itens corretamente', () => {
        cart = logic.addToCart(cart, mockProducts, 'Waffle with Berries');
        cart = logic.addToCart(cart, mockProducts, 'Macaron Mix of Five');
        cart = logic.incrementQuantity(cart, 'Macaron Mix of Five'); 
        const totalItems = logic.getCartTotalItems(cart);
        expect(totalItems).toBe(3);
    });
});