import user_model from '../models/user_model.js';
import bcrypt from 'bcrypt'; 
import { createToken} from '../helpers/jwt.js';

class user_controller {

    async register(req,res) {
        try {
            const { email , name , lastname , password, role} = req.body;
    
            const user = await user_model.getone({email});
    
            if (user) {
                return res.status(404).send('this email adress already exists');
            }
    
            const hash = await bcrypt.hash(password,10);
    
            const data = await user_model.register({
                email,
                name,
                lastname,
                password: hash,
                role
            });
    
            return res.status(200).send(data);
    
        } catch (error) {
            return res.status(500).send('Server error');        
        }
    }

    async login(req,res) {

        const {email, password} = req.body;

        const user = await user_model.getone({email});

        if (!user) {
            return res.status(404).send('this email adress does not exist in the system');
        }

        const validated_password = await bcrypt.compare(password, user.password);

        if (!validated_password) {
            return res.status(404).send('invalid password');
        }

        const token = createToken(user._id, user.role);

        return res.status(200).send({
            "mesage": 'user loged correctlly..',
            token: token
        });

    }

    async update(req,res) {
        const token = req.user;
        const user = await user_model.getoneid(token._id);
        
        const {email,name,lastname,password} = req.body;

        if (!user) {
            return res.status(400).send('user not found');
        }

        const hash = await bcrypt.hash(password,10); 
        
        const data = await user_model.update(user._id,{
            email,
            name,
            lastname,
            password: hash
        })

        return res.status(200).send(data);  //hola
    }

    async delete(req, res) {
        try {
            const token = req.user;

            const user = await user_model.getoneid(token._id);

            if (!user) {
                return res.status(404).send('User not found');
            }

            await user_model.delete(token._id);

            return res.status(200).send({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    async profile(req, res) {
        const token = req.user;
        const user = await user_model.getoneid(token._id);

        if (!user) {
            return res.status(404).send('this email adress does not exist in the system');
        }

        return res.status(200).send({
            email: user.email,
            name: user.name,
            lastname: user.lastname 
        });

    }

    // ADMIN: Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            const token = req.user;

            // Verificar que sea admin
            if (token.role !== 'admin') {
                return res.status(403).send('No tienes permisos de administrador');
            }

            const users = await user_model.getAll();

            return res.status(200).send(users);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

    // ADMIN: Buscar usuarios
    async searchUsers(req, res) {
        try {
            const token = req.user;
            const { search } = req.query;

            if (token.role !== 'admin') {
                return res.status(403).send('No tienes permisos de administrador');
            }

            const users = await user_model.search(search);

            return res.status(200).send(users);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

    // ADMIN: Eliminar usuario por ID
    async deleteUserById(req, res) {
        try {
            const token = req.user;
            const { id } = req.params;

            if (token.role !== 'admin') {
                return res.status(403).send('No tienes permisos de administrador');
            }

            // No permitir que el admin se elimine a sí mismo
            if (token._id === id) {
                return res.status(400).send('No puedes eliminar tu propia cuenta de administrador');
            }

            const user = await user_model.getoneid(id);

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            await user_model.delete(id);

            return res.status(200).send({ message: 'Usuario eliminado exitosamente' });

        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

    // ADMIN: Obtener estadísticas de usuarios
    async getUserStats(req, res) {
        try {
            const token = req.user;

            if (token.role !== 'admin') {
                return res.status(403).send('No tienes permisos de administrador');
            }

            const stats = await user_model.getStats();

            return res.status(200).send(stats);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

    // ADMIN: Obtener usuario con sus reservaciones
    async getUserWithReservations(req, res) {
        try {
            const token = req.user;
            const { id } = req.params;

            if (token.role !== 'admin') {
                return res.status(403).send('No tienes permisos de administrador');
            }

            const user = await user_model.getUserWithReservations(id);

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            return res.status(200).send(user);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

}

export default new user_controller();