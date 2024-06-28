import { Request, Response } from 'express';
import express from 'express';
import WorkingHoursController from '../controllers/working-hours';
import UserAuthentication from '../middlewares/auth';
import GroupUserController from "../controllers/group-user";

const router = express.Router();
const workingHoursController = new WorkingHoursController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post("/working-hours", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try {
        const { start, end } = request.query;
        const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as {id: number};
        const workingHoursData = {
            start: new Date(start as string),
            end: new Date(end as string)
        }
        const result = await workingHoursController.addWorkingHours(workingHoursData, groupUser.id);
        response.status(200).send(result);
    } catch (error) {
        response.status(400).send(error);
    }
})

router.get("/working-hours", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try {
        const { groupId, name } = request.query;
        const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as { role: string }
        const result = await workingHoursController.getWorkingHours(groupId as string, name as string, groupUser?.role as string);
        response.status(200).send(result);
    } catch (error) {
        response.status(400).send(error);
    }
})

router.get("/working-hours/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const groupUserId = request.params.id;
        const year = request.query.year as string;
        const month = request.query.month as string;
        const result = await workingHoursController.getWorkingHoursByGroupUserId(parseInt(groupUserId) as number, parseInt(month) as number, parseInt(year) as number);
        response.status(200).send({
            message: "Working hours retrieved successfully",
            type: "success",
            data: result
        });
    }
    catch(error){
        response.status(400).send(error);
    }
});

router.put("/working-hours/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const workingHourId = request.params.id;
        const { start, end } = request.query;
        const workingHoursData = {
            start: new Date(start as string),
            end: new Date(end as string)
        }
        const result = await workingHoursController.editWorkingHours(workingHoursData, workingHourId);
        response.status(200).send(result);
    }
    catch(error){
        response.status(400).send(error);
    }
})

router.delete("/working-hours/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const workingHourId = request.params.id;
        const result = await workingHoursController.deleteWorkingHours(workingHourId);
        response.status(200).send(result);
    }
    catch(error){
        response.status(400).send(error);
    }
})

export default router;