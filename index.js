import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import router from './src/routes/views.router.js';
import methodOverride from 'method-override';
import { Cart } from './src/models/cart.model.js';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import ProductManager from './src/managers/ProductManager.js';

const PORT = 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/backendFinal';
const pm = new ProductManager();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.set('io', io);

// Handlebars con helpers personalizados
const hbs = engine({
  helpers: {
    calcTotal: (products) => {
      let total = 0;
      products.forEach(p => {
        if (p.product && p.product.price && p.quantity) {
          total += p.product.price * p.quantity;
        }
      });
      return total.toFixed(2);
    },
    multiply: (a, b) => {
      return (a * b).toFixed(2);
    },
    formatPrice: (value) => {
      if (!value) return "$0.00";
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
      }).format(value);
    }
  }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.static('./public'));
app.use(methodOverride('_method'));

app.use('/', router);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', socket => {
  console.log('📡 Cliente conectado:', socket.id);

  socket.on('updateProductQuantity', async ({ cartId, productId, quantity }) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        socket.emit('errorCart', 'Carrito no encontrado');
        return;
      }

      const productInCart = cart.products.find(p => p.product.toString() === productId);
      if (!productInCart) {
        socket.emit('errorCart', 'Producto no existe en el carrito');
        return;
      }

      productInCart.quantity = quantity;
      await cart.save();

      const updatedCart = await Cart.findById(cartId).populate('products.product');
      io.emit('cartUpdated', updatedCart);

    } catch (error) {
      socket.emit('errorCart', error.message);
    }
  });

  socket.on('newProduct', async (product) => {
    try {
      product.price = Number(product.price);
      product.stock = Number(product.stock);

      await pm.addProduct(product);

      const products = await pm.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error agregando producto:', error);
      socket.emit('errorProduct', 'No se pudo agregar el producto.');
    }
  });

  socket.on('removeProductFromCart', async ({ cartId, productId }) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        socket.emit('errorCart', 'Carrito no encontrado');
        return;
      }

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      await cart.save();

      const updatedCart = await Cart.findById(cartId).populate('products.product');
      io.emit('cartUpdated', updatedCart);

    } catch (error) {
      socket.emit('errorCart', error.message);
    }
  });
});

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️  MongoDB conectado');

    httpServer.listen(PORT, () => {
      console.log(`🚀  Server listo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Error inicializando aplicación', err);
  }
})();

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ status: "error", message: "Error de validación", details: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ status: "error", message: "ID inválido", details: err.message });
  }

  res.status(500).json({ status: "error", message: "Error interno del servidor" });
});
