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
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const responseText = await groupController.createGroup(name as string, category as string, user?.id as number);
    response.status(201).json({ message: responseText }); 
})
router.get('/group',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const name = request.query.name as string;
    const groups = await groupController.getGroups(name);
    response.status(200).json({
        message: "Groups retrieved successfully",
        data: groups
    });
})

export default router; 