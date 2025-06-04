import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./data/carts.json');


router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json({
    status: "success",
    message: "Carrito creado correctamente",
    cart: newCart
});

});


router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(c => c.id === cartId.toString());
    if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});


    router.post('/:cid/product/:pid', async (req, res) => {
    const cart = await cartManager.addProductToCart(c => c.id === cartId.toString());
    if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
});

export default router;
