import ProductModel from '../models/product.model.js';

class ProductsMongodbDao {
    constructor() {
    }

    async getAllProducts(queryOptions, options) {
        const result = await ProductModel.paginate({ ...queryOptions, deleted: false }, options);
        return result;
    }

    async getProductById(pid) {
        return await ProductModel.findOne({ _id: pid, deleted: false }).lean();
    }

    async createProduct(product) {
        const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        product.id = newId;
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return newProduct.toObject();
    }

    async updateProduct(pid, updates) {
        const updated = await ProductModel.findByIdAndUpdate(
            pid,
            updates,
            { new: true }
        ).lean();
        return updated;
    }
    //eliminado lógico para evitar problemas al eliminar productos que están en órdenes generadas
    async deleteProduct(pid) {
        await ProductModel.findByIdAndUpdate(pid, { deleted: true });
    }

    //la dejo pero no la implemento
    async restoreProduct(pid) {
        await ProductModel.findByIdAndUpdate(pid, { deleted: false });
    }

    //no utilizado, lo dejo para el curso, solicita un delete físico
    async deleteProduct_fisico(id) {
        await ProductModel.deleteOne({ id: id });
    }

}

export default ProductsMongodbDao;