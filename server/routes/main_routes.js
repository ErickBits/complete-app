import express from 'express';
const route = express.Router();
import user_controller from '../controllers/user_controller.js';
import { compareToken } from '../helpers/jwt.js';

route.post('/register', user_controller.register);
route.get('/login', user_controller.login);
route.get('/profile', compareToken, user_controller.profile);
route.put('/update', compareToken, user_controller.update);
route.delete('/delete', compareToken, user_controller.delete);

export default route;