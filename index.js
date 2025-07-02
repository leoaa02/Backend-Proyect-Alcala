import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import router from './src/routes/views.router.js';
import ProductManager from './src/managers/ProductManager.js';

const pm = new ProductManager("./src/data/products.json");

import productsRouter from './src/routes/products.router.js';
import cartsRouter    from './src/routes/carts.router.js';

const PORT = 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/proyecto';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.set('io', io); 

// -- Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// -- Middlewares
app.use(express.json());

// -- Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', router);   

// 
app.get('/', (_req, res) => {
res.send('<h1>EJECUTANDO SERVIDOR...</h1>');
});
// -- WebSockets
    io.on('connection', socket => {
    console.log('📡 Cliente conectado:', socket.id);

    socket.on('newProduct', async product => {
    await pm.addProduct(product);
    const products = await pm.getProducts();
    io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', async id => {
    await pm.deleteProduct(id);
    const products = await pm.getProducts();
    io.emit('updateProducts', products);
    });
});

// -- Arranque
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
