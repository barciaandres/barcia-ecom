import ProductModel from '../models/product.model.js';

class ProductsMongodbDao {
    constructor() {
    }

    async getAllProducts() {
        return await ProductModel.find().lean();
    }

    async getProductById(id) {
        return await ProductModel.findOne({ id: id }).lean();
    }

    async getProductsByCategory(categorySlug) {
        return await ProductModel.find({ category: categorySlug }).lean();
    }

    async createProduct(product) {
        const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        product.id = newId;
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return newProduct.lean();
    }

    async updateProduct(id, updates) {
        const updated = await ProductModel.findOneAndUpdate(
            { id: id },
            { $set: updates },
            { new: true }
        ).lean();
        return updated;
    }

    async deleteProduct(id) {
        await ProductModel.deleteOne({ id: id });
    }
}

export default ProductsMongodbDao;