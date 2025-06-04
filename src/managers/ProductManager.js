import { promises as fs } from 'fs';

    export default class ProductManager {
    constructor(path) {
    this.path = path; 
    }

    async getProducts() {
        try {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
    return [];
    }
    }

    async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
    }

    async addProduct(productData) {
    const products = await this.getProducts();

    const newProduct = {
    id: Date.now().toString(), 
...productData,
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
}

    async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

        products[index] = {
        ...products[index],
        ...updates,
        id: products[index].id, 
    };

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
    }

    async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
    }
}
