import fs from 'fs/promises';

// Categories JSON DAO
class CategoriesJsonDao {
    constructor() {
        this.path = './src/data/categories.json';
    }

    async getAllCategories() {
        const categories = await this.#readCategories();
        return categories;
    }

    async #readCategories() {
        const json = await fs.readFile(this.path, 'utf-8');
        const categories = JSON.parse(json);
        return categories;
    }
}

export default new CategoriesJsonDao();
