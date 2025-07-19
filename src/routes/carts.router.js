import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import mongoose from "mongoose";

const router = Router();
const cartManager = new CartManager();

// Middleware para validar IDs de Mongo
router.param("cid", (req, res, next, cid) => {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ status: "error", message: "ID de carrito inválido" });
    }
    next();
});

router.param("pid", (req, res, next, pid) => {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ status: "error", message: "ID de producto inválido" });
    }
    next();
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }
        res.json({ status: "success", payload: cart });
    } catch (err) {
        next(err);
    }
});

// POST /api/carts -> Crear un carrito vacío
router.post("/", async (_req, res, next) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json({ status: "success", payload: cart });
    } catch (err) {
        next(err);
    }
});

// POST /api/carts/:cid/products/:pid -> Agregar producto
router.post("/:cid/products/:pid", async (req, res, next) => {
    try {
        const quantity = parseInt(req.body.quantity) || 1;
        await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
        res.redirect(`/cart/${req.params.cid}`);
    } catch (err) {
        next(err);
    }
});

// PUT /api/carts/:cid -> Reemplazar todo el array de productos
router.put("/:cid", async (req, res, next) => {
    try {
        const updated = await cartManager.updateCartProducts(req.params.cid, req.body.products);
        res.json({ status: "success", payload: updated });
    } catch (err) {
        next(err);
    }
});

// PUT /api/carts/:cid/products/:pid -> Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res, next) => {
    try {
        const quantity = parseInt(req.body.quantity);
        await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.redirect(`/cart/${req.params.cid}`);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/carts/:cid/products/:pid -> Eliminar un producto
router.delete("/:cid/products/:pid", async (req, res, next) => {
    try {
        await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.redirect(`/cart/${req.params.cid}`);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/carts/:cid -> Vaciar carrito
router.delete('/:cid', async (req, res, next) => {
    try {
        await cartManager.deleteAllProductsFromCart(req.params.cid);
        res.redirect(`/cart/${req.params.cid}`);
    } catch (err) {
        next(err);
    }
});

export default router;
