import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

class ProductManager {
    async getProducts(filter = {}, sort = {}) {
    return await Product.find(filter).sort(sort).lean();
    }

    async getProductsPaginated(page = 1, limit = 5, filter = {}, sortOption = {}) {
    const skip = (page - 1) * limit;
    //Contar documentos con filtros aplicados
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean();

        return {
        docs: products,
        totalPages,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        };
        }

    async getProductById(pid) {
        if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new Error("ID de producto no válido");
    }
    const product = await Product.findById(pid).lean();
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    return product;
    }

    async addProduct(productData) {
    return await Product.create(productData);
    }

    async updateProduct(pid, updateData) {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new Error("ID de producto no válido");
    }
    const updated = await Product.findByIdAndUpdate(pid, updateData, { new: true });
    if (!updated) {
    throw new Error("Producto no encontrado");
    }
    return updated;
    }

    async deleteProduct(pid) {
        if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new Error("ID de producto no válido");
    }
    const deleted = await Product.findByIdAndDelete(pid);
    if (!deleted) {
    throw new Error("Producto no encontrado");
    }
    return deleted;
    }
}

export default ProductManager;
