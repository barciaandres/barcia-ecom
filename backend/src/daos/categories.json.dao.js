import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Categories JSON DAO
class CategoriesJsonDao {
    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.path = path.join(__dirname, '../data/categories.json');
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
