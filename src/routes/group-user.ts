import express from 'express';
import { Request, Response } from 'express';
import GroupUserController from '../controllers/group-user';
import UserAuthentication from '../middlewares/auth';
import GroupUserUtils from '../utils/group-user';

const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();
const groupUserUtils = new GroupUserUtils();


const router = express.Router();

router.get('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, username } = request.query;
    const result = await groupUserController.getUsers(groupId as string, username as string);
    response.status(200).json(result);
})

router.get('/group-user/:userId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, userId } = request.params;
    const result = await groupUserController.getUser(groupId, parseInt(userId));
    response.status(200).json(result);
})

router.delete('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, userId } = request.query;
    const role = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
    const message = await groupUserController.deleteGroupUser(groupId as string, userId as unknown as number, role as string);
    response.status(200).json({ message });
})
router.put('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, userId, role } = request.query;
    const changingPersonRole = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
    const message = await groupUserController.changeRole(groupId as string, userId as unknown as number, changingPersonRole, role as string);
    response.status(200).json({ message });
})
router.post('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, userId, role } = request.query;
    const addingPersonRole = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
    const message = await groupUserController.addUser(userId as unknown as number,role as string, groupId as string, addingPersonRole as string);
    response.status(200).json({ message });
})


export default router;