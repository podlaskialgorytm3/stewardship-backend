import express from "express";
import { Request, Response } from "express";
import TaskAffilationController from "../controllers/task-affilation";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";
import UserController from "../controllers/user";

const router = express.Router();

const taskAffilationController = new TaskAffilationController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId, groupUserId } = request.query;
    const user = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as {role: string};
    const responseText = await taskAffilationController.addTaskAffilation(
        taskInfoId as unknown as number, 
        groupUserId as unknown as number,
        user?.role as string
    );
    response.status(201).json({ message: responseText });
})
router.get("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId } = request.query;
    const taskAffilation = await taskAffilationController.getTaskAffilation(taskInfoId as unknown as number);
    response.status(200).json(taskAffilation);
})
router.delete("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId, groupUserId } = request.query;
    const user = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as {role: string};
    const responseText = await taskAffilationController.deleteTaskAffilation(
        taskInfoId as unknown as number, 
        groupUserId as unknown as number, 
        user?.role as string
    );
    response.status(200).json({ message: responseText });
})



export default router;