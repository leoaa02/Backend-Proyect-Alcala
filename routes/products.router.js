import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

// GET /api/products
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET p:id
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

// POST 
router.post('/', async (req, res) => {
  const {
    title, description, code, price,
    status = true, stock, category, thumbnails = []
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newProduct = await productManager.addProduct({
    title, description, code, price,
    status, stock, category, thumbnails,
  });

  res.status(201).json(newProduct);
});

// PUT
router.put('/:pid', async (req, res) => {
  const id = req.params.pid;
  const updated = await productManager.updateProduct(id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(updated);
});

//DELETE
router.delete('/:pid', async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  res.json({ message: 'Producto eliminado' });
});

export default router;
