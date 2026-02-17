import ProductModel from '../models/product.model.js';

class ProductsMongodbDao {
    constructor() {
    }

    async getAllProducts(queryOptions, options) {
        const result = await ProductModel.paginate(queryOptions, options);
        return result;
    }

    async getProductById(pid) {
        return await ProductModel.findById(pid).lean();
    }

    async createProduct(product) {
        const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        product.id = newId;
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return newProduct.lean();
    }

    async updateProduct(pid, updates) {
        const updated = await ProductModel.findByIdAndUpdate(
            pid,
            updates,
            { new: true }
        ).lean();
        return updated;
    }

    async deleteProduct(pid) {
        await ProductModel.findByIdAndDelete(pid);
    }
}

export default ProductsMongodbDao;