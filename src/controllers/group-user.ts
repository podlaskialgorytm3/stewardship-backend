import GroupUser from "../models/group-user";
import User from "../models/user";
import Group from "../models/group";
import { v4 as uuidv4 } from 'uuid';

class GroupUserController {
    public createTable = async () => {
        GroupUser.sync({ alter: true })
            .then(() => {
                console.log('GroupUser table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the GroupUser table:', error);
            });
    }
    public addUser = async (userId: number, role: string, groupId: string) => {
        try {
            await GroupUser.create({
                id: uuidv4(),
                groupId,
                userId,
                role,
            });
            return "User added to group successfully";
        } catch (error) {
            return "An error occurred while adding the user to the group: " + error;
        }
    }
    public getUser = async (groupId: string, userId: number) => {
        try {
            const groupUser = await GroupUser.findOne({
                where: {
                    groupId,
                    userId,
                },
            });
            const user = await User.findOne({
                where: {
                    id: userId,
                },
            })
            const group = await Group.findOne({
                where: {
                    id: groupId,
                },
            })
            return {
                name: user?.name as string,
                email: user?.email as string,
                group: group?.name as string,
                img: user?.img as string,
                role: groupUser?.role as string,
            };
        }
        catch(error){
            return error;
        }
    }
    public getUsers = async (groupId: string, name: string) => {
        try {
            const groupUsers = await GroupUser.findAll({
                where: {
                    groupId,
                },
            });
            const group = await Group.findOne({
                where: {
                    id: groupId,
                },
            })
            const users = await Promise.all(groupUsers.map(async (groupUser) => {
                const user = await User.findOne({
                    where: {
                        id: groupUser.userId,
                    },
                });
                return {
                    name: user?.name as string,
                    group: group?.name as string,
                    email: user?.email as string,
                    img: user?.img as string,
                    role: groupUser.role,
                };
            }));
            return users.filter((user) => user.name.includes(name));
        }
        catch(error){
            return error;
        }
    }
    public deleteGroupUsers = async (groupId: string) => {
        try {
            await GroupUser.destroy({
                where: {
                    groupId,
                },
            });
            return "Group users deleted successfully";
        }
        catch(error){
            return error;
        }
    }
    public deleteGroupUser = async (groupId: string, userId: number) => {
        try {
            await GroupUser.destroy({
                where: {
                    groupId,
                    userId,
                },
            });
            return "User from your group deleted successfully";
        }
        catch(error){
            return error;
        }
    }
}

export default GroupUserController;