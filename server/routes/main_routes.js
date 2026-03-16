import express from 'express';
const route = express.Router();
import user_controller from '../controllers/user_controller.js';
import { compareToken } from '../helpers/jwt.js';

route.post('/register', user_controller.register);
route.post('/login', user_controller.login);
route.get('/profile', compareToken, user_controller.profile);
route.put('/update', compareToken, user_controller.update);
route.delete('/delete', compareToken, user_controller.delete);


// Rutas de administrador
route.get('/admin/users', compareToken, user_controller.getAllUsers);
route.get('/admin/users/search', compareToken, user_controller.searchUsers);
route.get('/admin/users/:id', compareToken, user_controller.getUserWithReservations);
route.delete('/admin/users/:id', compareToken, user_controller.deleteUserById);
route.get('/admin/stats', compareToken, user_controller.getUserStats);

export default route;