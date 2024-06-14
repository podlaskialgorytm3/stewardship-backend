import Group from "../models/group";
import { v4 as uuidv4 } from 'uuid';

import GroupUserController from "./group-user";

class GroupController {
    public groupUserController = new GroupUserController();
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
            await this.groupUserController.addUser(userId, 'admin', groupId);
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
    public getGroup = async (id: string) => {
        try {
            const group = await Group.findByPk(id);
            return {
                id: group?.id,
                name: group?.name,
                category: group?.category,
            };
        }
        catch(error){
            return error;
        }
    }
    public editGroup = async (id: string, name: string, category: string, userId: number) => {
        const user = await this.groupUserController.getUser(id, userId) as { role: string };
        const role = user?.role as string;
        if(role === 'admin'){
            try {
                await Group.update({
                    name,
                    category,
                }, {
                    where: {
                        id,
                    },
                });
                return "Group updated successfully";
            } catch (error) {
                return "An error occurred while updating the group: " + error;
            }
        } else {
            return "You do not have the permission to edit this group";
        }
    }
    public deleteGroup = async (id: string, userId: number) => {
        const user = await this.groupUserController.getUser(id, userId) as { role: string };
        const role = user?.role as string;
        if(role === 'admin'){
            try {
                await Group.destroy({
                    where: {
                        id,
                    },
                });
                await this.groupUserController.deleteGroupUsers(id);
                return "Group deleted successfully";
            } catch (error) {
                return "An error occurred while deleting the group: " + error;
            }
        } else {
            return "You do not have the permission to delete this group";
        }
    }
}

export default GroupController;