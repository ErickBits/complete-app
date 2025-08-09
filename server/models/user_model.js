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
}

export default new user_model();