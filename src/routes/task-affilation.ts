import express from "express";
import { Request, Response } from "express";
import TaskAffilationController from "../controllers/task-affilation";
import UserAuthentication from "../middlewares/auth";

const router = express.Router();

const taskAffilationController = new TaskAffilationController();
const userAuthentication = new UserAuthentication();

router.post("/task-affilation", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskInfoId, groupUserId } = request.query;
    const responseText = await taskAffilationController.addTaskAffilation(taskInfoId as unknown as number, groupUserId as unknown as number);
    response.status(201).json({ message: responseText });
})



export default router;