import WorkingHours from "../models/working-hours";
import GroupUserController from "./group-user";
import { WorkingHoursInterface } from "../types/working-hours";
import { v4 as uuidv4 } from 'uuid';

class WorkingHoursController {
    private groupUserController = new GroupUserController();
    public createTable = async () => {
        WorkingHours.sync({ alter: true })
            .then(() => {
                console.log('WorkingHours table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the WorkingHours table:', error);
            });
    }
    public addWorkingHours = async (workingHoursData: WorkingHoursInterface, groupUserId: number) => {
        try{
            const id = uuidv4();
            if (await this.isNotOverlap(groupUserId, workingHoursData.start, workingHoursData.end)) return "Working hours overlap with existing working hours";
            await WorkingHours.create({
                id: id,
                groupUserId: groupUserId,
                start: workingHoursData.start,
                end: workingHoursData.end,
                totalHours: (workingHoursData.end.getTime() - workingHoursData.start.getTime()) / 3600000
            });
            return "Working hours added successfully";
        }
        catch(error){
            throw "An error occurred while adding working hours: " + error;
        }
    }
    private isNotOverlap = async (groupUserId: number, startToCheck: Date, endToCheck: Date) => {
        try{
            const workingHours = await WorkingHours.findAll({
                where: {
                    groupUserId: groupUserId,
                }
            });
            const start = workingHours.map((workingHour) => workingHour.start.getTime());
            const end = workingHours.map((workingHour) => workingHour.end.getTime());
            for(let i = 0; i < start.length; i++){
                if((startToCheck.getTime() >= start[i] && startToCheck.getTime() <= end[i]) 
                || (endToCheck.getTime() >= start[i] && endToCheck.getTime() <= end[i])){
                    return true  
                }
            }
            return false
            
        }
        catch(error){
            return "An error occurred while checking working hours: " + error;
        }
    }
    private getWorkingHoursByGroupUserId = async (groupUserId: number) => {
        try{
            const workingHours = await WorkingHours.findAll({
                where: {
                    groupUserId: groupUserId
                }
            });
            return workingHours.map((workingHour) => {
                return {
                    id: workingHour.id as number,
                    start: workingHour.start as Date,
                    end: workingHour.end as Date,
                    totalHours: workingHour.totalHours as number
                }
            })
        }
        catch(error){
            return "An error occurred while getting working hours: " + error;
        }
    }
    public getWorkingHours = async (groupId: string, name: string, role: string) => {
        try{
            if(role !== "admin") return "You are not authorized to view working hours";
            const groupUsers = await this.groupUserController.getUserByName(groupId, name) as {id: number}[];
            return {
                message: "Working hours retrieved successfully",
                data: {
                    workingHours: await Promise.all(groupUsers.map(async (groupUser) => {
                        return {
                            groupUser: await this.groupUserController.getUserByGroupUserId(groupUser.id),
                            workingHours: await this.getWorkingHoursByGroupUserId(groupUser.id)
                        }
                    })
                )
                }
            };
        }
        catch(error){
            return "An error occurred while getting working hours: " + error;
        }
    }
}

export default WorkingHoursController;