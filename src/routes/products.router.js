import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET /api/products?category=...&page=1&limit=5&sort=asc
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
    let filters = {};

    if (query) {
          const [key, value] = query.split(':');
      if (key === 'category') {
        filter = { category: value };
      } else if (key === 'status' && (value === 'true' || value === 'false')) {
        filter = { status: value === 'true' };
      } else if (key === 'available' && (value === 'true' || value === 'false')) {
        filter = { stock: { $gt: 0 } }; 
      }
      
    }
    const products = await productManager.getProductsPaginated(
      parseInt(page),
      parseInt(limit),
      filter,
      sortOption
    );

    res.json({
      status: 'success',
      payload: productsResult.docs,
      totalPages: productsResult.totalPages,
      prevPage: productsResult.prevPage,
      nextPage: productsResult.nextPage,
      page: productsResult.page,
      hasPrevPage: productsResult.hasPrevPage,
      hasNextPage: productsResult.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message }); // Cambiado a JSON para consistencia
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res, next) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    const io = req.app.get('io');
    io.emit('productAction', { type: 'created', productId: newProduct._id });

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res, next) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);

    const io = req.app.get('io');
    io.emit('productAction', { type: 'updated', productId: updated._id });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res, next) => {
  try {
    const deleted = await productManager.deleteProduct(req.params.pid);

    const io = req.app.get('io');
    io.emit('productAction', { type: 'deleted', productId: deleted._id });

    res.json({ message: 'Producto eliminado', productId: deleted._id });
  } catch (err) {
    next(err);
  }
});

export default router;
