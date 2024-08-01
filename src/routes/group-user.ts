import express from 'express';
import { Request, Response } from 'express';
import GroupUserController from '../controllers/group-user';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';

const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();
const userController = new UserController();

const router = express.Router();

router.get('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, username } = request.query;
        const result = await groupUserController.getUsers(groupId as string, username as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

router.get('/group-user/:userId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId } = request.query;
        const { userId } = request.params;
        const result = await groupUserController.getUser(groupId as string, parseInt(userId));
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

router.delete('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, memberId } = request.query;
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await groupUserController.deleteGroupUser(parseInt(memberId as string) as number, groupUser.role, groupId as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, userId } = request.body;
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await groupUserController.changeRole(groupId as string, userId as unknown as number, groupUser.role);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.post('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, userId, role } = request.query;
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await groupUserController.addUser(userId as unknown as number,role as string, groupId as string, groupUser.role as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/group-user/is-member/:groupId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const  groupId  = request.params.groupId as string;
        const token = request.headers['authorization']?.split(' ')[1] as string;
        const userId = await userController.getUserIdByToken(token);
        const result = await groupUserController.isMemberOfGroup(groupId as string, userId as number);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/group-user/is-admin/:groupId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const  groupId  = request.params.groupId as string;
        const token = request.headers['authorization']?.split(' ')[1] as string;
        const result = await groupUserController.isAdminOfGroup(groupId as string, token as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})


export default router;