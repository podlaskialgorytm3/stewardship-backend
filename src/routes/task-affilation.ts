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
const userController = new UserController();

router.post("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId, groupUserId } = request.query;
    const responseText = await taskAffilationController.addTaskAffilation(taskInfoId as unknown as number, groupUserId as unknown as number);
    response.status(201).json({ message: responseText });
})
router.get("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId } = request.query;
    const taskAffilation = await taskAffilationController.getTaskAffilation(taskInfoId as unknown as number);
    response.status(200).json(taskAffilation);
})
router.delete("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId, groupUserId, groupId} = request.query;
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const groupUser = await groupUserController.getUser(groupId as string, user?.id as number) as {id: number; role: string, groupId: string};
    const responseText = await taskAffilationController.deleteTaskAffilation(taskInfoId as unknown as number, groupUserId as unknown as number, groupUser?.role as string);
    response.status(200).json({ message: responseText });
})



export default router;