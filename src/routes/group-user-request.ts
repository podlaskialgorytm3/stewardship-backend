import express from 'express';
import { Request, Response } from 'express';
import GroupUserRequestController from '../controllers/group-user-request';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';
import GroupUser from '../controllers/group-user';

const router = express.Router();

const groupUserRequestController = new GroupUserRequestController();    
const userAuthentication = new UserAuthentication();
const userController = new UserController();
const groupUser = new GroupUser();

router.post('/group-user-request', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId } = request.query;
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const responseText = await groupUserRequestController.addRequest(user?.id as number, groupId as string);
    response.status(201).json({ message: responseText });
})

router.get('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    const { groupId } = request.query;
    const responseText = await groupUserRequestController.getRequests(groupId as string);
    response.status(201).json({ message: responseText });
})
router.put('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    const { groupId, userId, status } = request.query;
    console.log(groupId, userId, status)
    const owner = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const user = await groupUser.getUser(groupId as string, owner?.id as number) as {role: string};
    const responseText = await groupUserRequestController.changeStatus(groupId as string, userId as unknown as number,status as string, user?.role as string);
    response.status(201).json({ message: responseText });
})

export default router;