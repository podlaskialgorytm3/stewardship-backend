import { Request, Response, NextFunction } from 'express';

import UserModal from '../models/user';
import UserUtils from '../utils/user';
import jwt from 'jsonwebtoken';

class UserAuthentication {
    refreshToken(arg0: string) {
        throw new Error('Method not implemented.');
    }
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
                    const token =  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '15s'});
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
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (error, user) => {
            if (error) {
                return resposne.status(403).json({
                    message: 'Failed to authenticate token'
                });
            }
        });
        next();
    }
}

export default UserAuthentication;