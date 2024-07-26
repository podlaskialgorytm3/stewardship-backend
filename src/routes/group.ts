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
    try{
        const { name, category } = request.query;
        const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
        const result = await groupController.createGroup(name as string, category as string, user?.id as number);
        response.status(201).json(result); 
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/group',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const name = request.query.name as string;
        const result = await groupController.getGroups(name);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/group/:id',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const id = request.params.id;
        const result = await groupController.getGroup(id);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/group/:id',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
        const id = request.params.id;
        const { name, category } = request.query;
        const result = await groupController.editGroup(id, name as string, category as string, user?.id as number);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.delete('/group/:id',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
        const id = request.params.id;
        const result = await groupController.deleteGroup(id, user?.id as number);
        response.status(200).json(result)
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/group/:name',userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const name = request.params.name;
        const result = await groupController.getGroupsByName(name);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

export default router; 