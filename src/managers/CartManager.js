import { Cart } from "../models/cart.model.js";

class CartManager {
    async getCartById(cid) {
        return await Cart.findById(cid).populate('products.product').lean();
    }

    async createCart() {
        return await Cart.create({ products: [] });
    }

    async addProductToCart(cid, productId, quantity = 1) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");


        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async updateCartProducts(cid, newProducts) {
        return await Cart.findByIdAndUpdate(cid, { products: newProducts }, { new: true });
    }

    async updateProductQuantity(cid, productId, quantity) {
        const cart = await Cart.findById(cid);
        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            return await cart.save();
        }
        return null;
    }

    async deleteProductFromCart(cid, productId) {
        return await Cart.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    }

    async deleteAllProductsFromCart(cid) {
        return await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    }
}

export default CartManager;
