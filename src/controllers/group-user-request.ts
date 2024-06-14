import GroupUserRequest from '../models/group-user-request';
import { v4 as uuidv4 } from 'uuid';

import GroupUserController from './group-user';

class GroupUserRequestController {
    public groupUserController = new GroupUserController();
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
            return requests;
        }
        catch(error){
            return error;
        }
    }
}

export default GroupUserRequestController;