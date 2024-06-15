import express from 'express';
import { Request, Response } from 'express';
import GroupUserController from '../controllers/group-user';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';

const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

const router = express.Router();

router.get('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId, username } = request.query;
    const users = await groupUserController.getUsers(groupId as string, username as string);
    response.status(200).json({ users });
})



export default router;