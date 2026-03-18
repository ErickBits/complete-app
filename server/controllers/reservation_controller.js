import reservation_model from '../models/reservation_model.js';
import user_model from '../models/user_model.js'; 

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

    // Detectar tipo de usuario y asignar metodo para obtener estadisticas.
    getStatistics = async (req, res) => {
        try {
            console.log('=== INICIO getStatistics ===');
            const token = req.user;
            const isAdmin = token.role === 'admin';

            console.log('¿Es admin?', isAdmin);

            if (isAdmin) {
                console.log('Llamando a getAdminStatistics...');
                return await this.getAdminStatistics(req, res);
            } else {
                console.log('Llamando a getUserStatistics...');
                return await this.getUserStatistics(req, res);
            }

        } catch (error) {
            console.error('❌ ERROR EN getStatistics:', error);
            return res.status(500).json({ error: 'Server error', details: error.message });
        }
    }

    // Estadisticas de el usuario Admin
    getAdminStatistics = async (req, res) => {
        try {
            console.log('--- Inicio getAdminStatistics ---');
            
            const userStats = await user_model.getStats();
            const generalStats = await reservation_model.getGeneralStats();
            const allReservations = await reservation_model.getAllWithDetails();

            // Análisis por día de la semana
            const byDay = Array(7).fill(0);
            allReservations.forEach(r => {
                const day = new Date(r.date).getDay();
                byDay[day]++;
            });

            // Top mesas más reservadas
            const tableCount = {};
            allReservations.forEach(r => {
                tableCount[r.tableNumber] = (tableCount[r.tableNumber] || 0) + 1;
            });
            const topTables = Object.entries(tableCount)
                .map(([table, count]) => ({ table: parseInt(table), count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Tendencia mensual (últimos 6 meses)
            const today = new Date();
            const monthlyTrend = [];
            
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59);
                
                const count = allReservations.filter(r => {
                    const resDate = new Date(r.date);
                    return resDate >= monthStart && resDate <= monthEnd;
                }).length;

                monthlyTrend.push({
                    month: monthStart.getMonth(),
                    year: monthStart.getFullYear(),
                    count
                });
            }

            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            const occupiedTables = await reservation_model.getOccupiedTablesCount(todayStart, todayEnd);
            const availableTables = 12 - occupiedTables;

            const response = {
                role: 'admin',
                totalUsers: userStats.totalUsers,
                adminUsers: userStats.adminUsers,
                regularUsers: userStats.regularUsers,
                totalReservations: generalStats.total,
                pendingReservations: generalStats.pending,
                confirmedReservations: generalStats.confirmed,
                cancelledReservations: generalStats.cancelled,
                completedReservations: generalStats.completed,
                todayReservations: generalStats.today,
                availableTables,
                reservationsByDay: byDay,
                topTables,
                monthlyTrend
            };

            console.log('✅ Respuesta admin:', response);
            return res.status(200).json(response);

        } catch (error) {
            console.error('❌ ERROR EN getAdminStatistics:', error);
            return res.status(500).json({ error: 'Server error', details: error.message });
        }
    }

    // Estadisticas de el usuario cliente
    getUserStatistics = async (req, res) => {
        try {
            console.log('--- Inicio getUserStatistics ---');
            const token = req.user;
            
            const userReservations = await reservation_model.getUserReservationsWithDetails(token._id);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const pending = userReservations.filter(r => r.status === 'pending').length;
            const confirmed = userReservations.filter(r => r.status === 'confirmed').length;
            const cancelled = userReservations.filter(r => r.status === 'cancelled').length;
            const completed = userReservations.filter(r => r.status === 'completed').length;

            const upcoming = userReservations.filter(r => 
                new Date(r.date) >= today && (r.status === 'pending' || r.status === 'confirmed')
            ).length;

            const past = userReservations.filter(r => 
                new Date(r.date) < today
            ).length;

            const byDay = Array(7).fill(0);
            userReservations.forEach(r => {
                const day = new Date(r.date).getDay();
                byDay[day]++;
            });

            const monthlyTrend = [];
            
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59);
                
                const count = userReservations.filter(r => {
                    const resDate = new Date(r.date);
                    return resDate >= monthStart && resDate <= monthEnd;
                }).length;

                monthlyTrend.push({
                    month: monthStart.getMonth(),
                    year: monthStart.getFullYear(),
                    count
                });
            }

            const tableCount = {};
            userReservations.forEach(r => {
                tableCount[r.tableNumber] = (tableCount[r.tableNumber] || 0) + 1;
            });
            const favoriteTables = Object.entries(tableCount)
                .map(([table, count]) => ({ table: parseInt(table), count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            const response = {
                role: 'user',
                myReservations: userReservations.length,
                totalReservations: userReservations.length,
                upcomingReservations: upcoming,
                pastReservations: past,
                pendingReservations: pending,
                confirmedReservations: confirmed,
                cancelledReservations: cancelled,
                completedReservations: completed,
                reservationsByDay: byDay,
                monthlyTrend,
                favoriteTables
            };

            console.log('✅ Respuesta usuario:', response);
            return res.status(200).json(response);

        } catch (error) {
            console.error('❌ ERROR EN getUserStatistics:', error);
            return res.status(500).json({ error: 'Server error', details: error.message });
        }
    }
}

export default new reservation_controller();