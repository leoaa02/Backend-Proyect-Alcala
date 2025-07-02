import fs from 'fs/promises';
import { existsSync } from 'fs';

export default class ProductManager {
    constructor(path) {
    this.path = path;
    }

    async #readFile() {
    try {
        if (!existsSync(this.path)) {
        await fs.writeFile(this.path, '[]');
    }
    console.log('🔍 Leyendo:', this.path);          // <— NUEVO
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
    } catch (err) {
    console.error('❌ Error en #readFile:', err);   // <— NUEVO
    throw err;                                     // hace que router devuelva 500
    }
}

    async #saveFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async getProducts() {
    return await this.#readFile();
    }

    async getProductById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id === Number(id));
    }

    async addProduct(productData) {
    const products = await this.#readFile();
    const id = products.length ? products.at(-1).id + 1 : 1;
    const newProduct = { id, ...productData };
    products.push(newProduct);
    await this.#saveFile(products);
    return newProduct;
    }

    async updateProduct(id, updates) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id: products[index].id };
    await this.#saveFile(products);
    return products[index];
    }

    async deleteProduct(id) {
    const products = await this.#readFile();
    const filtered = products.filter(p => p.id !== Number(id));
    if (filtered.length === products.length) return false; // no se borró nada
    await this.#saveFile(filtered);
    return true;
    }
}
