import reservation_model from '../models/reservation_model.js';

class reservation_controller {

    // Crear nueva reservación
    async create(req, res) {
        try {
            const token = req.user;
            const {
                customerName,
                customerEmail,
                customerPhone,
                tableNumber,
                numberOfGuests,
                date,
                time,
                specialRequests
            } = req.body;

            const existingReservation = await reservation_model.getByDateAndTable(
                new Date(date),
                tableNumber
            );

            if (existingReservation) {
                return res.status(400).json({ error: 'Esta mesa ya está reservada para esta fecha' });
            }

            const data = await reservation_model.create({
                userId: token._id,
                customerName,
                customerEmail,
                customerPhone,
                tableNumber,
                numberOfGuests,
                date: new Date(date),
                time,
                specialRequests
            });

            return res.status(201).json({
                message: 'Reservación creada exitosamente',
                reservation: data
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Obtener todas las reservaciones (solo admin)
    async getAll(req, res) {
        try {
            const token = req.user;

            if (token.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permisos para ver todas las reservaciones' });
            }

            const reservations = await reservation_model.getAll();
            return res.status(200).json(reservations);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Obtener mis reservaciones
    async getMyReservations(req, res) {
        try {
            const token = req.user;
            const reservations = await reservation_model.getByUserId(token._id);
            return res.status(200).json(reservations);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Obtener reservación por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const token = req.user;

            const reservation = await reservation_model.getById(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reservación no encontrada' });
            }

            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permisos para ver esta reservación' });
            }

            return res.status(200).json(reservation);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Obtener reservaciones por día
    async getByDay(req, res) {
        try {
            const { date } = req.params;

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const reservations = await reservation_model.getByDate(startOfDay, endOfDay);
            return res.status(200).json(reservations);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Obtener reservaciones de la semana
    async getWeekReservations(req, res) {
        try {
            const { startDate } = req.query;

            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + 7);

            const reservations = await reservation_model.getWeekReservations(start, end);
            return res.status(200).json(reservations);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Actualizar reservación
    async update(req, res) {
        try {
            const { id } = req.params;
            const token = req.user;
            const updates = req.body;

            const reservation = await reservation_model.getById(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reservación no encontrada' });
            }

            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permisos para actualizar esta reservación' });
            }

            if (updates.date || updates.tableNumber) {
                const dateToCheck  = updates.date        ? new Date(updates.date) : reservation.date;
                const tableToCheck = updates.tableNumber || reservation.tableNumber;

                const existingReservation = await reservation_model.getByDateAndTable(dateToCheck, tableToCheck);

                if (existingReservation && existingReservation._id.toString() !== id) {
                    return res.status(400).json({ error: 'Esta mesa ya está reservada para esta fecha' });
                }
            }

            if (updates.date) updates.date = new Date(updates.date);

            const data = await reservation_model.update(id, updates);

            return res.status(200).json({
                message: 'Reservación actualizada exitosamente',
                data
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Cambiar estado de reservación
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const token = req.user;

            const reservation = await reservation_model.getById(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reservación no encontrada' });
            }

            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permisos para cambiar el estado' });
            }

            const data = await reservation_model.updateStatus(id, status);

            return res.status(200).json({
                message: 'Estado actualizado exitosamente',
                data
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Eliminar reservación
    async delete(req, res) {
        try {
            const { id } = req.params;
            const token = req.user;

            const reservation = await reservation_model.getById(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reservación no encontrada' });
            }

            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permisos para eliminar esta reservación' });
            }

            await reservation_model.delete(id);

            return res.status(200).json({ message: 'Reservación eliminada exitosamente' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Obtener estadísticas (dashboard)
    async getStats(req, res) {
        try {
            const token = req.user;
            const userId = token.role === 'admin' ? null : token._id;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7);

            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth   = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

            const todayReservations = await reservation_model.countByDateRange(today, endOfToday, userId);
            const weekReservations  = await reservation_model.countByDateRange(startOfWeek, endOfWeek, userId);
            const monthReservations = await reservation_model.countByDateRange(startOfMonth, endOfMonth, userId);

            const totalTables    = 12;
            const occupiedTables = await reservation_model.getOccupiedTablesCount(today, endOfToday);
            const availableTables = totalTables - occupiedTables;

            return res.status(200).json({
                todayReservations,
                weekReservations,
                totalReservations: monthReservations,
                totalTables,
                availableTables
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

export default new reservation_controller();