/*import*/
import user_schema from "../schemas/user_schema.js";

class user_model {

    async register(new_user) {
        return await user_schema.create(new_user);
    }

    async getone(email) {
        return await user_schema.findOne(email); 
    }    

    async getoneid(id) {
        return await user_schema.findById(id);
    }

    async update(_id,data) {
        return await user_schema.updateOne({ _id: _id }, { $set: data });
    }

    async delete(id) {
        return await user_schema.deleteOne({ _id: id });
    }

    //ADMIN

    async getAll() {
        return await user_schema.find().select('-password').sort({ createdAt: -1 });
    }

    async search(searchTerm) {
        return await user_schema.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        }).select('-password');
    }

    async getStats() {
        const totalUsers = await user_schema.countDocuments();
        const adminUsers = await user_schema.countDocuments({ role: 'admin' });
        const regularUsers = await user_schema.countDocuments({ role: { $ne: 'admin' } });
        
        return {
            totalUsers,
            adminUsers,
            regularUsers
        };
    }

    async getUserWithReservations(userId) {
        return await user_schema.findById(userId)
            .select('-password')
            .lean();
    }
}

export default new user_model();