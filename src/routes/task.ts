import express from 'express';
import { Request, Response } from 'express';
import TaskController from '../controllers/task';
import UserAuthentication from '../middlewares/auth';

const router = express.Router();

const userAuthentication = new UserAuthentication();
const taskController = new TaskController();

router.post("/task", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { name } = request.query;
        const result = await taskController.createTask(name as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})
router.get("/task", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { name } = request.query;
        const result = await taskController.getTasksByName(name as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})


export default router;