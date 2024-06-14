import Group from "../models/group";
import { v4 as uuidv4 } from 'uuid';

import GroupUserController from "./group-user";

const groupUserController = new GroupUserController();

class GroupController {
    public createTable = async () => {
        Group.sync({ alter: true })
            .then(() => {
                console.log('Group table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Group table:', error);
            });
    }
    public createGroup = async (name: string, category: string, userId: number) => {
        const groupId = uuidv4() as string;
        try {
            await Group.create({
                id: groupId,
                name,
                category,
            });
            await groupUserController.addUser(userId, 'admin', groupId);
            return "Group created successfully";
        } catch (error) {
            return "An error occurred while creating the group: " + error;
        }
    }
    public getGroups = async (name: string) => {
        try {
            const groups = await Group.findAll({
                attributes: ['id', 'name', 'category'],
            });
            return groups.filter((group) => group.name.includes(name) && group);;
        }
        catch(error){
            return error;
        }
    }
}

export default GroupController;