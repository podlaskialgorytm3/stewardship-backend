import { v4 as uuidv4 } from 'uuid';
import TaskInfo from '../models/task-info';
import TaskAffilation from '../models/task-affilation';
import { TaskInfoCreation as TaskInfoInterface, SubtaskCreation, TaskAffilationsCreation } from '../types/task';
import TaskAffilationController from './task-affilation';
import GroupUserController from './group-user';
import SubTaskController from './sub-task';

class TaskInfoController {
    public taskAffilationController = new TaskAffilationController();
    public groupUserController = new GroupUserController();
    public subTaskController = new SubTaskController();
    public createTable = async () => {
        TaskInfo.sync({ alter: true })
            .then(() => {
                console.log('TaskInfo table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the TaskInfo table:', error);
            });
    }
    public createTaskInfo = async (taskInfo: TaskInfoInterface, subTasks: SubtaskCreation[], taskAffilations: TaskAffilationsCreation[], groupId: string, token: string) => {
        try{
            const id = uuidv4();
            const user = await this.groupUserController.getUserByTokenGroup(token, groupId);
            await TaskInfo.create({
                id: id,
                name: taskInfo['task-name'],
                startDate: taskInfo['start-date'],
                endDate: taskInfo['end-date'],
                status: taskInfo.status,
                priority: taskInfo.priority,
                comments: taskInfo.comments,
                assignedBy: user?.id
            });
            if(subTasks.length > 0){
                await Promise.all(subTasks.map(async (subTask) => {
                    await this.subTaskController.createSubTask(subTask, user?.id as number, id as unknown as number);
                }));
            }
            if(taskAffilations.length > 0){
                await Promise.all(taskAffilations.map(async (taskAffilation) => {
                    await this.taskAffilationController.addTaskAffilation(id as unknown as number, taskAffilation.memberId, user?.role as string);
                }));
            }
            return {
                message: "Task info created successfully",
                type: "success"
            }
        }
        catch(error){
                return{
                    message: "An error occurred while creating task info: " + error,
                    type: "error"
                }
            }
    } 
    public getTaskInfo = async (taskInfoId: number) => {
        try{
            const taskInfo = await TaskInfo.findByPk(taskInfoId);
            const taskAffilations = await this.taskAffilationController.getTaskAffilation(taskInfoId);
            const subTasks = await this.subTaskController.getSubTasks(taskInfoId);
            return {
                taskInfo: {
                    id: taskInfo?.id,
                    name: taskInfo?.name,
                    startDate: taskInfo?.startDate,
                    endDate: taskInfo?.endDate,
                    status: taskInfo?.status,
                    priority: taskInfo?.priority,
                    assignedBy: await this.groupUserController.getUserByGroupUserId(taskInfo?.assignedBy as number),
                    comments: taskInfo?.comments,
                },
                subTasks: subTasks,
                members: taskAffilations
            };
        }
        catch(error){
            return {
                message: "An error occurred while getting task info: " + error,
                type: "error"
            }
        }
    }
    public getTasksInfo = async (groupUserId: number) => {
        try{
            const taskInfoIds = await TaskAffilation.findAll({
                where: {
                    groupUserId: groupUserId
                },
                attributes: ['taskInfoId']
            });        
            return Promise.all(
                taskInfoIds.map(async (taskInfoId: {taskInfoId: number}) => {
                    return await this.getTaskInfo(taskInfoId.taskInfoId);
                }))
        }
        catch(error){
            return {
                message: "An error occurred while getting tasks info: " + error,
                type: "error"
            }
        }
    }

    public editTaskInfo = async (taskInfoId: number, taskInfo: TaskInfoInterface, role: string) => {
        try{
            if(role !== "admin"){
                return {
                    message: "You are not authorized to edit this task info",
                    type: "info"
                }
            }
            else{
                await TaskInfo.update({
                    name: taskInfo['task-name'],
                    startDate: taskInfo['start-date'],
                    endDate: taskInfo['end-date'],
                    status: taskInfo.status,
                    priority: taskInfo.priority,
                    comments: taskInfo.comments
                }, {
                    where: {
                        id: taskInfoId
                    }
                });
                return {
                    message: "Task info updated successfully",
                    type: "success"
                }
            }
        }
        catch(error){
            return  {
                message: "An error occurred while updating task info: " + error,
                type: "error"
            
            }
        }
    }
    public deleteTaskInfo = async (taskInfoId: number, role: string) => {
        try{
            if(role !== "admin"){
                return {
                    message: "You are not authorized to delete this task info",
                    type: "info"
                }
            }
            else{
                await TaskInfo.destroy({
                    where: {
                        id: taskInfoId
                    }
                });
                await this.taskAffilationController.deleteTaskAffilationByTaskInfoId(taskInfoId, role);
                await this.subTaskController.deleteSubTaskByTaskInfoId(taskInfoId);
                return {
                    message: "Task info deleted successfully",
                    type: "success"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while deleting task info: " + error,
                type: "error"
            }
        }
    }
}

export default TaskInfoController;