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

        return res.status(200).send(data);

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

}

export default new user_controller();