import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const cartManager = new CartManager();
const pm = new ProductManager();
const router = Router();

const CART_ID = "6872aa3ace3c58e434c1bad1"; // usalo desde constante

// Vista de todos los productos paginados
router.get('/products', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const paginated = await pm.getProductsPaginated(page, limit);

        res.render('products', {
            title: "Productos",
            products: paginated.docs,
            page: paginated.page,
            totalPages: paginated.totalPages,
            hasPrevPage: paginated.hasPrevPage,
            prevPage: paginated.prevPage,
            hasNextPage: paginated.hasNextPage,
            nextPage: paginated.nextPage,
            cartId: CART_ID
        });
    } catch (err) {
        next(err);
    }
});
router.get('/', (req, res) => {
    res.redirect('/products');
});

// Vista detalle de producto
router.get("/products/:pid", async (req, res, next) => {
    try {
        const product = await pm.getProductById(req.params.pid);
        if (!product) return res.status(404).send("Producto no encontrado");

        res.render("productDetail", {
            title: product.title,
            product,
            cartId: CART_ID
        });
    } catch (err) {
        next(err);
    }
});

// Vista carrito
router.get('/cart/:cid', async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.render('cart', { cart });
    } catch (err) {
        next(err);
    }
});

// Real Time Products
router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render('realtimeproducts', { products });
});

export default router;
