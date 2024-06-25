import WorkingHours from "../models/working-hours";
import { WorkingHoursInterface } from "../types/working-hours";
import { v4 as uuidv4 } from 'uuid';

class WorkingHoursController {
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
    public isNotOverlap = async (groupUserId: number, startToCheck: Date, endToCheck: Date) => {
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
}

export default WorkingHoursController;