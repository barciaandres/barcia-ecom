import UserModel from '../models/user.model.js';

class UsersMongodbDao {
    constructor() {
    }
    async getUserByEmail(email) {
        return await UserModel.findOne({ email: email }).lean();
    }
    async createUser(userData) {
        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser.toObject();
    }
}

export default UsersMongodbDao;