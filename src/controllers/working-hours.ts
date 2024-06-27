import WorkingHours from "../models/working-hours";
import GroupUserController from "./group-user";
import { WorkingHoursInterface } from "../types/working-hours";
import { v4 as uuidv4 } from 'uuid';

class WorkingHoursController {
    private groupUserController = new GroupUserController();
    private currentMonth = new Date().getMonth() + 1;
    private currentYear = new Date().getFullYear();
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
            if (workingHoursData.start.getTime() > workingHoursData.end.getTime()) return "Start time cannot be greater than end time.";
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
    public getWorkingHoursByGroupUserId = async (groupUserId: number, month: number = this.currentMonth as number, year: number = this.currentYear as number) => {
        try{
            const workingHours = await WorkingHours.findAll({
                where: {
                    groupUserId: groupUserId,
                }
            });
            month = !month ? this.currentMonth : month;
            year = !year ? this.currentYear : year;
            return Promise.all(
                workingHours.filter((workingHour) => {
                    if (workingHour.start.getMonth() + 1 === month && workingHour.start.getFullYear() === year) {
                        return {
                            id: workingHour.id,
                            start: workingHour.start,
                            end: workingHour.end,
                            totalHours: workingHour.totalHours
                        }
                    }
                })
            )
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
                data: await Promise.all(groupUsers.map(async (groupUser) => {
                        return {
                            groupUser: await this.groupUserController.getUserByGroupUserId(groupUser.id),
                            workingHours: await this.getWorkingHoursByGroupUserId(groupUser.id)
                        }
                    })
                )
            };
        }
        catch(error){
            return "An error occurred while getting working hours: " + error;
        }
    }
    public editWorkingHours = async (workingHoursData: WorkingHoursInterface, workingHourId: string) => {
        try{
            const workingHours = await WorkingHours.findByPk(workingHourId);
            if(!workingHours) return "Working hours not found";
            await workingHours.update({
                start: workingHoursData.start,
                end: workingHoursData.end,
                totalHours: (workingHoursData.end.getTime() - workingHoursData.start.getTime()) / 3600000
            });
            return "Working hours updated successfully";
        }
        catch(error){
            return "An error occurred while updating working hours: " + error;
        }
    }
    public deleteWorkingHours = async (workingHourId: string) => {
        try{
            const workingHours = await WorkingHours.findByPk(workingHourId);
            if(!workingHours) return "Working hours not found";
            await workingHours.destroy();
            return "Working hours deleted successfully";
        }
        catch(error){
            return "An error occurred while deleting working hours: " + error;
        }
    }
}

export default WorkingHoursController;