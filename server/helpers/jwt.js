import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function createToken(_id,role) {
    return jwt.sign({_id,role}, process.env.KEY, {expiresIn: '1h'});
}

export function compareToken(req,res,next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({
                "mesage": 'There is no token in this ...',
                token: token
            }
        );
    }

    try {
        const verified_token = jwt.verify(token,process.env.KEY);
        req.user = verified_token;
        next();
    } catch (error) {
        return res.status(403).send('invalid token');
    }
}