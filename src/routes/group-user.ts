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
        const { groupId, userId } = request.params;
        const result = await groupUserController.getUser(groupId, parseInt(userId));
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

router.delete('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, userId } = request.query;
        const role = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
        const result = await groupUserController.deleteGroupUser(groupId as string, userId as unknown as number, role as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, userId, role } = request.query;
        const changingPersonRole = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
        const result = await groupUserController.changeRole(groupId as string, userId as unknown as number, changingPersonRole, role as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.post('/group-user', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId, userId, role } = request.query;
        const addingPersonRole = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
        const result = await groupUserController.addUser(userId as unknown as number,role as string, groupId as string, addingPersonRole as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})


export default router;