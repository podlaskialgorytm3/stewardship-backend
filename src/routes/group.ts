import express from 'express';
import { Request, Response } from 'express';
import GroupController from '../controllers/group';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';

const router = express.Router();

const groupController = new GroupController();
const userAuthentication = new UserAuthentication();
const userController = new UserController();

router.post('/group',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { name, category } = request.query;
    const userId = await userController.getIdByToken(request.headers['authorization']?.split(' ')[1] as string);
    const responseText = await groupController.createGroup(name as string, category as string, userId as number);
    response.status(201).json({ message: responseText }); 
})

export default router; 