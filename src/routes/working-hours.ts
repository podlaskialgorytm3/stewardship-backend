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


export default router;