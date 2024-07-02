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
            await this.groupUserController.addUser(userId, 'admin', groupId, "admin");
            return {
                message: "Group created successfully",
                type: "success",
            }
        } catch (error) {
            return {
                message: "An error occurred while creating the group: " + error,
                type: "error",
            }
        }
    }
    public getGroups = async (name: string) => {
        try {
            const groups = await Group.findAll({
                attributes: ['id', 'name', 'category'],
            });
            return {
                message: "Groups retrieved successfully",
                data: groups.filter((group) => group.name.includes(name) && group),
                type: "success"
            }
        }
        catch(error){
            return {
                message: "An error occurred while retrieving the groups: " + error,
                type: "error"
            };
        }
    }
    public getGroup = async (id: string) => {
        try {
            const group = await Group.findByPk(id);
            return {
                message: "Group retrieved successfully",
                data: {
                    id: group?.id,
                    name: group?.name,
                    category: group?.category,
                },
                type: "success"
            }
        }
        catch(error){
            return {
                message: "An error occurred while retrieving the group: " + error,
                type: "error"
            };
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
                return {
                    message: "Group updated successfully",
                    type: "success",
                }
            } catch (error) {
                return {
                    message: "An error occurred while updating the group: " + error,
                    type: "error",
                }
            }
        } else {
            return {
                message: "You do not have the permission to edit this group",
                type: "error",
            }
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
                return {
                    message: "Group deleted successfully",
                    type: "success",
                }
            } catch (error) {
                return {
                    message: "An error occurred while deleting the group: " + error,
                    type: "error",
                }
            }
        } else {
            return {
                message: "You do not have the permission to delete this group",
                type: "error",
            }
        }
    }
}

export default GroupController;