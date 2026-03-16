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

    // Obtener estadísticas generales (admin)
    async getGeneralStats() {
        const total = await reservation_schema.countDocuments();
        const pending = await reservation_schema.countDocuments({ status: 'pending' });
        const confirmed = await reservation_schema.countDocuments({ status: 'confirmed' });
        const cancelled = await reservation_schema.countDocuments({ status: 'cancelled' });
        const completed = await reservation_schema.countDocuments({ status: 'completed' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayCount = await reservation_schema.countDocuments({
            date: { $gte: today, $lte: endOfToday }
        });

        return {
            total,
            pending,
            confirmed,
            cancelled,
            completed,
            today: todayCount
        };
    }

    // Obtener todas las reservaciones con información completa (para análisis)
    async getAllWithDetails() {
        return await reservation_schema.find()
            .populate('userId', 'name email role')
            .sort({ date: -1 });
    }

    // Obtener reservaciones de un usuario con detalles (para análisis personal)
    async getUserReservationsWithDetails(userId) {
        return await reservation_schema.find({ userId })
            .sort({ date: -1 });
    }

    // Contar reservaciones por rango de fecha
    async countByDateRange(startDate, endDate, userId = null) {
        const query = {
            date: { $gte: startDate, $lte: endDate }
        };
        
        if (userId) {
            query.userId = userId;
        }

        return await reservation_schema.countDocuments(query);
    }

    // Obtener mesas ocupadas en un rango de fecha
    async getOccupiedTablesCount(startDate, endDate) {
        const reservations = await reservation_schema.find({
            date: { $gte: startDate, $lte: endDate },
            status: { $in: ['pending', 'confirmed'] }
        }).distinct('tableNumber');

        return reservations.length;
    }

}

export default new reservation_model();