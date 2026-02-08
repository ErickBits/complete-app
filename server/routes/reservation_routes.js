import { Router } from 'express';
import reservation_controller from '../controllers/reservation_controller.js';
import { compareToken } from '../helpers/jwt.js'; // ← Usar tu middleware

const router = Router();

// Todas las rutas requieren autenticación
router.use(compareToken); // ← Cambiar verifyToken por compareToken

// Crear reservación
router.post('/create', reservation_controller.create);

// Obtener todas las reservaciones (admin)
router.get('/all', reservation_controller.getAll);

// Obtener mis reservaciones
router.get('/my-reservations', reservation_controller.getMyReservations);

// Obtener estadísticas para dashboard
router.get('/stats', reservation_controller.getStats);

// Obtener reservaciones por día
router.get('/day/:date', reservation_controller.getByDay);

// Obtener reservaciones de la semana
router.get('/week', reservation_controller.getWeekReservations);

// Obtener reservación por ID
router.get('/:id', reservation_controller.getById);

// Actualizar reservación completa
router.put('/:id', reservation_controller.update);

// Cambiar solo el estado
router.patch('/:id/status', reservation_controller.updateStatus);

// Eliminar reservación
router.delete('/:id', reservation_controller.delete);

export default router;