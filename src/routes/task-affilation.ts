import express from "express";
import { Request, Response } from "express";
import TaskAffilationController from "../controllers/task-affilation";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";

const router = express.Router();

const taskAffilationController = new TaskAffilationController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, groupUserId, groupId } = request.query;
        const user = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await taskAffilationController.addTaskAffilation(
            taskInfoId as unknown as number, 
            groupUserId as unknown as number,
            user?.role as string
        );
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})
router.get("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId } = request.query;
        const result = await taskAffilationController.getTaskAffilation(taskInfoId as unknown as number);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})
router.delete("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, groupUserId, groupId } = request.query;
        const user = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await taskAffilationController.deleteTaskAffilation(
            taskInfoId as unknown as number, 
            groupUserId as unknown as number, 
            user?.role as string
        );
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})



export default router;