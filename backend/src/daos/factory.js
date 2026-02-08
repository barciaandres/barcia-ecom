// DAO Factory para migrar de json a mongo, ya no lo necesito. lo dejo
import ProductsMongodbDao from './products.mongodb.dao.js';
import CategoriesMongodbDao from './categories.mongodb.dao.js';
import OrdersMongodbDao from './orders.mongodb.dao.js';
import UsersMongodbDao from './users.mongodb.dao.js';

const getDAO = (type) => {
    switch (type) {
        case 'products':
            return new ProductsMongodbDao();
        case 'categories':
            return new CategoriesMongodbDao();
        case 'orders':
            return new OrdersMongodbDao();
        case 'users':
            return new UsersMongodbDao();
        default:
            throw new Error('Invalid DAO type for MongoDB data source');
    }
}

export default getDAO;
