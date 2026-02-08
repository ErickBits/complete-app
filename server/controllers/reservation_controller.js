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

            // Validar que la mesa no esté ocupada en esa fecha/hora
            const existingReservation = await reservation_model.getByDateAndTable(
                new Date(date), 
                tableNumber
            );

            if (existingReservation) {
                return res.status(400).send('Esta mesa ya está reservada para esta fecha');
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

            return res.status(201).send({
                message: 'Reservación creada exitosamente',
                reservation: data
            });

        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    // Obtener todas las reservaciones (solo admin)
    async getAll(req, res) {
        try {
            const token = req.user;

            // Verificar si es admin
            if (token.role !== 'admin') {
                return res.status(403).send('No tienes permisos para ver todas las reservaciones');
            }

            const reservations = await reservation_model.getAll();

            return res.status(200).send(reservations);

        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    // Obtener mis reservaciones
    async getMyReservations(req, res) {
        try {
            const token = req.user;

            const reservations = await reservation_model.getByUserId(token._id);

            return res.status(200).send(reservations);

        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    // Obtener reservación por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const token = req.user;

            const reservation = await reservation_model.getById(id);

            if (!reservation) {
                return res.status(404).send('Reservación no encontrada');
            }

            // Verificar que sea el dueño o admin
            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).send('No tienes permisos para ver esta reservación');
            }

            return res.status(200).send(reservation);

        } catch (error) {
            return res.status(500).send('Server error');
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

            return res.status(200).send(reservations);

        } catch (error) {
            return res.status(500).send('Server error');
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

            return res.status(200).send(reservations);

        } catch (error) {
            return res.status(500).send('Server error');
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
                return res.status(404).send('Reservación no encontrada');
            }

            // Verificar que sea el dueño o admin
            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).send('No tienes permisos para actualizar esta reservación');
            }

            // Si actualiza fecha/mesa, validar disponibilidad
            if (updates.date || updates.tableNumber) {
                const dateToCheck = updates.date ? new Date(updates.date) : reservation.date;
                const tableToCheck = updates.tableNumber || reservation.tableNumber;

                const existingReservation = await reservation_model.getByDateAndTable(
                    dateToCheck,
                    tableToCheck
                );

                if (existingReservation && existingReservation._id.toString() !== id) {
                    return res.status(400).send('Esta mesa ya está reservada para esta fecha');
                }
            }

            if (updates.date) {
                updates.date = new Date(updates.date);
            }

            const data = await reservation_model.update(id, updates);

            return res.status(200).send({
                message: 'Reservación actualizada exitosamente',
                data
            });

        } catch (error) {
            return res.status(500).send('Server error');
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
                return res.status(404).send('Reservación no encontrada');
            }

            // Verificar que sea el dueño o admin
            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).send('No tienes permisos para cambiar el estado');
            }

            const data = await reservation_model.updateStatus(id, status);

            return res.status(200).send({
                message: 'Estado actualizado exitosamente',
                data
            });

        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    // Eliminar reservación
    async delete(req, res) {
        try {
            const { id } = req.params;
            const token = req.user;

            const reservation = await reservation_model.getById(id);

            if (!reservation) {
                return res.status(404).send('Reservación no encontrada');
            }

            // Verificar que sea el dueño o admin
            if (reservation.userId._id.toString() !== token._id && token.role !== 'admin') {
                return res.status(403).send('No tienes permisos para eliminar esta reservación');
            }

            await reservation_model.delete(id);

            return res.status(200).send({
                message: 'Reservación eliminada exitosamente'
            });

        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    // Obtener estadísticas (dashboard)
    async getStats(req, res) {
        try {
            const token = req.user;

            // Solo admin o el propio usuario
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
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

            // Estadísticas
            const todayReservations = await reservation_model.countByDateRange(today, endOfToday, userId);
            const weekReservations = await reservation_model.countByDateRange(startOfWeek, endOfWeek, userId);
            const monthReservations = await reservation_model.countByDateRange(startOfMonth, endOfMonth, userId);

            // Mesas disponibles (asumiendo que tienes 12 mesas)
            const totalTables = 12;
            const occupiedTables = await reservation_model.getOccupiedTablesCount(today, endOfToday);
            const availableTables = totalTables - occupiedTables;

            return res.status(200).send({
                todayReservations,
                weekReservations,
                monthReservations,
                totalTables,
                availableTables
            });

        } catch (error) {
            return res.status(500).send('Server error');
        }
    }
}

export default new reservation_controller();