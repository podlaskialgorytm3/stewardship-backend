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
    const users = await groupUserController.getUsers(groupId as string, username as string);
    response.status(200).json({ users });
})
router.delete('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, userId } = request.query;
    const role = await groupUserUtils.getRole(request.query.groupId as string, request.headers['authorization']?.split(' ')[1] as string);
    const message = await groupUserController.deleteGroupUser(groupId as string, userId as unknown as number, role as string);
    response.status(200).json({ message });
})


export default router;