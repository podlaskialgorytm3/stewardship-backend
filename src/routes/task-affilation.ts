import express from "express";
import { Request, Response } from "express";
import TaskAffilationController from "../controllers/task-affilation";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";
import TaskInfoController from "../controllers/task-info";

const router = express.Router();

const taskAffilationController = new TaskAffilationController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();
const taskInfoController = new TaskInfoController();

router.post("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, groupUserId } = request.body;
        const token = request.headers['authorization']?.split(' ')[1] as string;
        const groupId = taskInfoController.getGroupIdByTaskInfoId({taskInfoId} as {taskInfoId: string});
        const user = await groupUserController.getUserByTokenGroup(token, groupId as unknown as string) as {id: string, role: string};
        const result = await taskAffilationController.addTaskAffilation(
            taskInfoId as string, 
            groupUserId as string,
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
        const { taskInfoId, username } = request.query as {taskInfoId: string, username: string};
        const result = await taskAffilationController.searchMembersAddedToTask({taskInfoId, username});
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})
router.get("/task-affilation/off-task", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, username } = request.query as {taskInfoId: string, username: string};
        const result = await taskAffilationController.searchMembersOffTask({taskInfoId, username});
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
});

router.delete("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, groupUserId } = request.query;
        const token = request.headers['authorization']?.split(' ')[1] as string;
        const groupId = taskInfoController.getGroupIdByTaskInfoId({taskInfoId} as {taskInfoId: string});
        const user = await groupUserController.getUserByTokenGroup(token, groupId as unknown as string) as {id: string, role: string};
        const result = await taskAffilationController.deleteTaskAffilation(
            taskInfoId as string, 
            groupUserId as string, 
            user?.role as string
        );
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})



export default router;