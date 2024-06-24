import GroupUserRequest from '../models/group-user-request';
import { v4 as uuidv4 } from 'uuid';

import GroupUserController from './group-user';
import UserController from './user';
import GroupController from './group';

class GroupUserRequestController {
    public groupUserController = new GroupUserController();
    public userController = new UserController();
    public groupController = new GroupController();
    public createTable = async () => {
        GroupUserRequest.sync({ alter: true })
            .then(() => {
                console.log('GroupUserRequest table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the GroupUserRequest table:', error);
            });
    }
    public addRequest = async (userId: number, groupId: string) => {
        try {
            await GroupUserRequest.create({
                id: uuidv4(),
                groupId,
                userId,
                status: "pending",
            });
            return "Request sent successfully";
        } catch (error) {
            return "An error occurred while sending the request: " + error;
        }
    }
    public getRequests = async (groupId: string) => {
        try {
            const requests = await GroupUserRequest.findAll({
                where: {
                    groupId,
                }
            });
            return {
                requests: await Promise.all(requests.map(async (request) => {
                    return {
                        id: request.id,
                        userId: await this.userController.getUser(String(request.userId)),
                        groupId: await this.groupController.getGroup(String(request.groupId)),
                        status: request.status,
                    }
                }))
            };
        }
        catch(error){
            return error;
        }
    }
    public changeStatus = async (groupId: string, userId: number, status: string, role: string) => {
        try{
            if(role != "admin"){
                return "You are not authorized to change the status of the request";
            }
            else{
                if(status === "accepted"){
                    await this.groupUserController.addUser(userId, "member", groupId, role);
                    await GroupUserRequest.destroy({
                        where: {
                            groupId,
                            userId,
                        }
                    })
                    return "Request accepted successfully";
                }
                else if(status === "rejected"){
                    await GroupUserRequest.destroy({
                        where: {
                            groupId,
                            userId,
                        }
                    })
                    return "Request rejected successfully";
                }
                else{
                    return "Invalid status";
                }
            }
        }
        catch(error){
            return error;
        }
    }
}

export default GroupUserRequestController;