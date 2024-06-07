import { Request, Response } from 'express';
import express from 'express';
import UserController  from '../controllers/user';

const userController = new UserController;

const router = express.Router();

router.post('/user', (request: Request, resposne: Response) => {
    const user = userController.createUser(request.body);
    resposne.status(201).json({
        message: 'User created successfully',
        user: user
    });
})
router.get('/user', async (request: Request, resposne: Response)  => {
    const users = await userController.getUsers();
    resposne.status(200).json({
        message: 'Users fetched successfully',
        data: users
    });
})

export default router;