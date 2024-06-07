import { Request, Response } from 'express';
import express from 'express';
import UserController  from '../controllers/user';
import UserInterFace from '../types/user';

const userController = new UserController;

const router = express.Router();

router.post('/user', (request: Request, resposne: Response) => {
    const {name, img, email, password} = request.query;
    const userInfo: UserInterFace = {
        name: name as string,
        img: img as string,
        email: email as string,
        password: password as string
    } 
    userController.createUser(userInfo);
    resposne.status(201).json({
        message: 'User created successfully',
        user: {}
    });
})
router.get('/user', async (request: Request, resposne: Response)  => {
    const users = await userController.getUsers();
    resposne.status(200).json({
        message: 'Users fetched successfully',
        data: users
    });
})
router.post('/user/auth', async (request: Request, resposne: Response) => {
    const {email, password} = request.query;
    const user = await userController.authonticateUser(email as string, password as string);
    if(user){
        resposne.status(200).json({
            message: 'User authenticated successfully',
            user: user
        });
    }
    else{
        resposne.status(401).json({
            message: 'User not authenticated'
        });
    }
})

export default router;