import reservation_schema from "../schemas/reservation_schema.js";

class reservation_model {

    async create(new_reservation) {
        return await reservation_schema.create(new_reservation);
    }

    async getAll() {
        return await reservation_schema.find()
            .populate('userId', 'name email')
            .sort({ date: 1, time: 1 });
    }

    async getByUserId(userId) {
        return await reservation_schema.find({ userId })
            .sort({ date: 1, time: 1 });
    }

    async getById(id) {
        return await reservation_schema.findById(id)
            .populate('userId', 'name email');
    }

    async getByDate(startDate, endDate) {
        return await reservation_schema.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ time: 1 });
    }

    async getByDateAndTable(date, tableNumber) {
        return await reservation_schema.findOne({
            date: date,
            tableNumber: tableNumber,
            status: { $in: ['pending', 'confirmed'] }
        });
    }

    async update(_id, data) {
        return await reservation_schema.updateOne(
            { _id: _id }, 
            { $set: data }
        );
    }

    async updateStatus(_id, status) {
        return await reservation_schema.updateOne(
            { _id: _id },
            { $set: { status } }
        );
    }

    async delete(id) {
        return await reservation_schema.deleteOne({ _id: id });
    }

    async getWeekReservations(startDate, endDate) {
        return await reservation_schema.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1, time: 1 });
    }

}

export default new reservation_model();