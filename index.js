import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';

import productsRouter from './src/routes/products.router.js';
import cartsRouter    from './src/routes/carts.router.js';

const PORT = 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/proyecto';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// -- Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// -- Middlewares
app.use(express.json());

// -- Rutas
app.get('/', (_req, res) => {
    res.send('<h1>EJECUTANDO SERVIDOR...</h1>');
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// -- WebSockets
io.on('connection', socket => {
    console.log('📡  Cliente conectado:', socket.id);
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
