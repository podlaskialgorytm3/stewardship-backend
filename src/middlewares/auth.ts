import { Request, Response, NextFunction } from 'express';
import { Payload } from './types/auth'

import UserModal from '../models/user';
import UserUtils from '../utils/user';
import jwt, { VerifyErrors} from 'jsonwebtoken';

class UserAuthentication {
    public userUtils = new UserUtils();
    public authonticateUser = async (email: string, password: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    email: email
                }
                
            });
            if (user) {
                const isPasswordValid: boolean = await this.userUtils.comparePassword(password, user.password);
                if (isPasswordValid) {
                    const payload = user.toJSON();
                    const token =  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '45s'});
                    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string);
                    return {token, refreshToken};
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        catch(error){
            return error;
        }
    }
    public authMiddleware = (request: Request, resposne: Response, next: NextFunction) => {
        const token = request.headers['authorization']?.split(' ')[1] as string;
        if (!token) {
            return resposne.status(401).json({
                message: 'No token provided'
            });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (error: VerifyErrors | null, user: Payload | any) => {
            if (error) {
                return resposne.status(403).json({
                    message: 'Failed to authenticate token',
                    error: error.message
                });
            }
            request.body.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                img: user.img,
                iat: new Date(parseInt(user.iat) * 1000 + 60 * 60 * 1000 * 2),
                exp: new Date(parseInt(user.exp) * 1000 + 60 * 60 * 1000 * 2),
            };
            next();
        });
    }
}

export default UserAuthentication;