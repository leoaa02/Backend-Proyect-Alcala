import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const productManager = new ProductManager(
  path.resolve(__dirname, '../data/products.json')
);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST /api/products  (crear)
router.post('/', async (req, res) => {
  const {
    title, description, code, price,
    status = true, stock, category, thumbnails = []
  } = req.body;

  // Validación mínima
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const newProduct = await productManager.addProduct({
      title, description, code, price,
      status, stock, category, thumbnails,
    });

    // ↪️ Emitir a todos los clientes
    const io = req.app.get('io');
    io.emit('productsUpdated', await productManager.getProducts());

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/products/:pid  (actualizar)
router.put('/:pid', async (req, res) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });

    // ↪️ Avisar a los clientes
    const io = req.app.get('io');
    io.emit('productsUpdated', await productManager.getProducts());

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const ok = await productManager.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });

    // ↪️ Avisar a los clientes
    const io = req.app.get('io');
    io.emit('productsUpdated', await productManager.getProducts());

    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

export default router;
