import GroupUserRequest from '../models/group-user-request';
import User from '../models/user';
import { v4 as uuidv4 } from 'uuid';

import GroupUserController from './group-user';
import UserController from './user';
import GroupController from './group';
import { request } from 'http';

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
        const groupUserRequestId = uuidv4();
        try {
            await GroupUserRequest.create({
                id: groupUserRequestId,
                groupId,
                userId,
                status: "pending",
            });
            return {
                message: "Request sent successfully",
                type: "success"
            }
        } catch (error) {
            return {
                message: "An error occurred while sending the request: " + error,
                type: "error"
            }
        }
    }
    public getRequests = async (groupId: string, username: string) => {
        try {
            const requests = await GroupUserRequest.findAll({
                where: {
                    groupId,
                    status: "pending",  
                }
            });
            return {
                message: "Requests fetched successfully",
                type: "success",
                data: await Promise.all(requests.map(async (request) => {
                    return {
                        id: request.id,
                        user: await this.userController.getUser(String(request.userId)),
                        groupId: await this.groupController.getGroup(String(request.groupId)),
                        status: request.status,
                    }
                }))
            };
        }
        catch(error){
            return {
                message: "An error occurred while fetching the requests: " + error,
                type: "error"
            };
        }
    }
    public changeStatus = async (groupId: string, userId: number, status: string, role: string) => {
        try{
            if(role != "admin"){
                return {
                    message: "You are not authorized to change the status",
                    type: "error"
                };
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
                    return {
                        message: "Request accepted successfully",
                        type: "success"
                    };
                }
                else if(status === "rejected"){
                    await GroupUserRequest.destroy({
                        where: {
                            groupId,
                            userId,
                        }
                    })
                    return {
                        message: "Request rejected successfully",
                        type: "success"
                    };
                }
                else{
                    return {
                        message: "Invalid status",
                        type: "error"
                    };
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while changing the status: " + error,
                type: "error"
            };
        }
    }
    public deleteRequest = (groupId: string, userId: number) => {
        try{
            GroupUserRequest.destroy({
                where: {
                    groupId,
                    userId,
                }
            })
            return {
                message: "Request deleted successfully",
                type: "success"
            };
        }
        catch(error){
            return {
                message: "An error occurred while deleting the request: " + error,
                type: "error"
            };
        }
    }
}

export default GroupUserRequestController;