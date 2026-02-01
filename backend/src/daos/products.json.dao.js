import fs from 'fs/promises';

// Products JSON DAO
class ProductsJsonDao {
    constructor() {
        // En el futuro, la ruta al archivo JSON podría venir de una configuración
        this.path = './src/data/products.json';
    }

    async getAllProducts() {
        const products = await this.#readProducts();
        return products;
    }

    async getProductById(id) {
        const products = await this.#readProducts();
        const product = products.find(p => p.id === Number(id));
        return product;
    }

    async getProductsByCategory(categoryName) {
        const products = await this.#readProducts();
        const productsByCategory = products.filter(p => p.category === categoryName);
        return productsByCategory;
    }

    async createProduct(product) {
        let products = await this.#readProducts();
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        await this.#writeProducts(products);
        return product;
    }

    async updateProduct(product) {
        let products = await this.#readProducts();
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products[index] = product;
        }
        await this.#writeProducts(products);
    }

    async deleteProduct(id) {
        let products = await this.#readProducts();
        products = products.filter(p => p.id !== Number(id));
        await this.#writeProducts(products);
    }

    async #readProducts() {
        const json = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(json);
        return products;
    }

    async #writeProducts(products) {
        const json = JSON.stringify(products, null, 2);
        await fs.writeFile(this.path, json);
    }
}

export default new ProductsJsonDao();
