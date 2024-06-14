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
router.get('/group/:id',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const id = request.params.id;
    const group = await groupController.getGroup(id);
    response.status(200).json({
        message: "Group retrieved successfully",
        data: group
    });
})
router.put('/group/:id',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const id = request.params.id;
    const { name, category } = request.query;
    const responseText = await groupController.editGroup(id, name as string, category as string, user?.id as number);
    response.status(200).json({ message: responseText });
})

export default router; 