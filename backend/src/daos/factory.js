// DAO Factory
import ProductsJsonDao from './products.json.dao.js';
import CategoriesJsonDao from './categories.json.dao.js';
import OrdersJsonDao from './orders.json.dao.js';

const getDAO = (type) => {
    switch (type) {
        case 'products':
            return ProductsJsonDao;
        case 'categories':
            return CategoriesJsonDao;
        case 'orders':
            return OrdersJsonDao;
        default:
            throw new Error('Invalid DAO type');
    }
}

export default getDAO;
