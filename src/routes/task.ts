import express from 'express';
import { Request, Response } from 'express';
import TaskController from '../controllers/task';
import UserAuthentication from '../middlewares/auth';

const router = express.Router();

const userAuthentication = new UserAuthentication();
const taskController = new TaskController();

router.post("/task", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { name } = request.query;
    const task = await taskController.createTask(name as string);
    response.json({
        message: task
    });
})
router.get("/task", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { name } = request.query;
    const tasks = await taskController.getTasksByName(name as string);
    response.json({
        message: "Tasks retrieved successfully",
        data: tasks
    });
})


export default router;