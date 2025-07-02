import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
    
const router = Router();
const pm = new ProductManager("./src/data/products.json");

    router.get('/', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products });
});

    router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render('realTimeProducts', { products });
});
export default router;