import CategoryModel from '../models/category.model.js';

class CategoriesMongodbDao {
    constructor() { }

    async getAllCategories() {
        return await CategoryModel.find().lean();
    }

    async getCategoryById(id) {
        return await CategoryModel.findById(id).lean();
    }

    async getCategoryBySlug(slug) {
        return await CategoryModel.findOne({ slug: slug }).lean();
    }

    async createCategory(category) {
        const newCategory = new CategoryModel(category);
        await newCategory.save();
        return newCategory.lean();
    }

    async updateCategory(id, updates) {
        const updated = await CategoryModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).lean();
        return updated;
    }

    async deleteCategory(id) {
        await CategoryModel.findByIdAndDelete(id);
    }
}

export default CategoriesMongodbDao;
