import { Router } from 'express';
import reservation_controller from '../controllers/reservation_controller.js';
import { compareToken } from '../helpers/jwt.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(compareToken);

// ⭐ IMPORTANTE: Rutas específicas ANTES de rutas con parámetros dinámicos

// Crear reservación
router.post('/create', reservation_controller.create);

// ⭐ MOVER ESTO ARRIBA - Obtener estadísticas (DEBE IR ANTES de /:id)
router.get('/statistics', reservation_controller.getStatistics);

// Obtener todas las reservaciones (admin)
router.get('/all', reservation_controller.getAll);

// Obtener mis reservaciones  
router.get('/my-reservations', reservation_controller.getMyReservations);

// Obtener reservaciones por día
router.get('/day/:date', reservation_controller.getByDay);

// Obtener reservaciones de la semana
router.get('/week', reservation_controller.getWeekReservations);

// ⭐ Esta ruta SIEMPRE debe ir AL FINAL (después de todas las rutas específicas)
// Obtener reservación por ID
router.get('/:id', reservation_controller.getById);

// Actualizar reservación completa
router.put('/:id', reservation_controller.update);

// Cambiar solo el estado
router.patch('/:id/status', reservation_controller.updateStatus);

// Eliminar reservación
router.delete('/:id', reservation_controller.delete);

export default router;