import fs from 'fs/promises';

// Orders JSON DAO
class OrdersJsonDao {
    constructor() {
        this.path = './src/data/orders.json';
    }

    async getAllOrders() {
        const orders = await this.#readOrders();
        return orders;
    }

    async getOrderById(id) {
        const orders = await this.#readOrders();
        const order = orders.find(o => o.id === id);
        return order;
    }

    async createOrder(order) {
        const orders = await this.#readOrders();
        order.id = orders.length + 1;
        orders.push(order);
        await this.#writeOrders(orders);
        return order;
    }

    async #readOrders() {
        const json = await fs.readFile(this.path, 'utf-8');
        const orders = JSON.parse(json);
        return orders;
    }

    async #writeOrders(orders) {
        const json = JSON.stringify(orders, null, 2);
        await fs.writeFile(this.path, json);
    }
}

export default new OrdersJsonDao();
