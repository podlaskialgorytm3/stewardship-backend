import GroupUser from "../models/group-user";
import GroupUserRequest from "../models/group-user-request";
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
    public addUser = async (userId: number, role: string, groupId: string, addingPersonRole: string) => {
        try {
            if(addingPersonRole !== "admin"){
                return {
                    message: "You are not authorized to add the user",
                    type: "error",
                }
            }
            else{
                const groupUser = await GroupUser.findOne({
                    where: {
                        groupId,
                        userId,
                    },
                });
                if (groupUser) {
                    return {
                        message: "User already exists in the group",
                        type: "error"
                    }
                }
                else {
                    await GroupUser.create({
                        id: uuidv4(),
                        userId,
                        groupId,
                        role,
                    });
                    await GroupUserRequest.destroy({
                        where: {
                            userId,
                            groupId,
                        },
                    })
                    return {
                        message: "User added successfully",
                        type: "success"
                    }
                }
            }
        } catch (error) {
            return {
                message: "An error occurred while adding the user: " + error,
                type: "error"
            }
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
                    id: groupUser?.id as number,
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
                    }
                });
                return {
                    id: groupUser?.id as number,
                    userId: groupUser.userId as number,
                    name: user?.name as string,
                    group: group?.name as string,
                    email: user?.email as string,
                    img: user?.img as string,
                    role: groupUser.role,
                };
            }));
            return {
                message: "Users retrieved successfully",
                data: users.filter((user) => user.name.includes(name)),
                type: "success"
            }
        }
        catch(error){
            return {
                message: "An error occurred while getting the users: " + error,
                type: "error"
            };
        }
    }
    public getUserByGroupUserId = async (groupUserId: number) => {
        try {
            const groupUser = await GroupUser.findOne({
                where: {
                    id: groupUserId,
                },
            });
            const user = await User.findOne({
                where: {
                    id: groupUser?.userId,
                },
            });
            const group = await Group.findOne({
                where: {
                    id: groupUser?.groupId,
                },
            });
            return {
                id: groupUser?.id as number,
                name: user?.name as string,
                email: user?.email as string,
                group: group?.name as string,
                img: user?.img as string,
                role: groupUser?.role as string,
            };
        }
        catch(error){
            return "An error occurred while getting the user by group user id: " + error;
        }
    }
    public getUserByToken = async (token: string) => {
        try{
            const user = await User.findOne({
                where: {
                    accessToken: token,
                },
            });
            const groupUser = await GroupUser.findOne({
                where: {
                    userId: user?.id,
                },
            });
            const group = await Group.findOne({
                where: {
                    id: groupUser?.groupId,
                },
            });
            return {
                id: groupUser?.id as number,
                name: user?.name as string,
                email: user?.email as string,
                group: group?.name as string,
                img: user?.img as string,
                role: groupUser?.role as string,
            }
        }
        catch(error){
            return error
        }
    }
    public getUserByTokenGroup = async (token: string, groupId: string) => {
        try{
            const user = await User.findOne({
                where: {
                    accessToken: token,
                },
            });
            const groupUser = await GroupUser.findOne({
                where: {
                    userId: user?.id,
                    groupId: groupId,
                },
            });
            const group = await Group.findOne({
                where: {
                    id: groupUser?.groupId,
                },
            });
            return {
                id: groupUser?.id as number,
                name: user?.name as string,
                email: user?.email as string,
                group: group?.name as string,
                img: user?.img as string,
                role: groupUser?.role as string,
            }
        }
        catch(error){
            return error
        }
    }
    public getUserByName = async (groupId: string, name: string) => {
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
                    id: groupUser?.id as number,
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
            return "An error occurred while getting the user by name: " + error;
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
    public deleteGroupUser = async (groupUserId: number, role: string, groupId: string) => {
        try {
            const quantityOfUsers = await this.getQuantityOfUsers(groupId);
            if(quantityOfUsers === 1){
                return {
                    message: "You cannot delete the last user",
                    type: "error"
                }
            }
            if(role !== "admin"){
                return {
                    message: "You are not authorized to delete the user",
                    type: "error",
                }
            }
            else{
                await GroupUser.destroy({
                    where: {
                        id: groupUserId
                    },
                });
                return {
                    message: "User deleted successfully",
                    type: "success",
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while deleting the user: " + error,
                type: "error",
            };
        }
    }
    public getQuantityOfAdmins = async (groupId: string) => {
        try{
            const groupUsers = await GroupUser.findAll({
                where: {
                    groupId: groupId,
                    role: "admin",
                },
            });
            return groupUsers.length;
        }
        catch(error){
            return error;
        }
    }
    public getQuantityOfUsers = async (groupId: string) => {
        try{
            const groupUsers = await GroupUser.findAll({
                where: {
                    groupId: groupId,
                },
            });
            return groupUsers.length;
        }
        catch(error){
            return error;
        }
    }
    public changeRole = async (groupId: string, userId: number, changingPersonRole: string) => {
        try {
            const groupUser = await this.getUser(groupId, userId) as {role: string};
            const quantityOfAdmins = await this.getQuantityOfAdmins(groupId);
            const role = groupUser?.role === "admin" ? "member" : "admin";
            if(quantityOfAdmins === 1 && groupUser?.role === "admin"){
                return {
                    message: "You cannot change the role of the last admin",
                    type: "error"
                }
            }
            else if(changingPersonRole !== "admin"){
                return {
                    message: "You are not authorized to change the role",
                    type: "error",
                }
            }
            else{
                await GroupUser.update({
                    role,
                }, {
                    where: {
                        groupId,
                        userId,
                    },
                });
                return {
                    message: "Role changed successfully",
                    type: "success",
                }
            }
            
        }
        catch(error){
            return {
                message: "An error occurred while changing the role: " + error,
                type: "error",
            };
        }
    }
    public isMemberOfGroup = async (groupId: string, userId: number) => {
        try{
            const groupUser = await GroupUser.findOne({
                where: {
                    groupId,
                    userId,
                },
            });
            if(groupUser){
                return true;
            }
            else{
                return false;
            }
        }
        catch(error){
            return false;
        }
    }
    public isAdminOfGroup = async (groupId: string, token: string) => {
        try{
            const user = await User.findOne({
                where: {
                    accessToken: token,
                },
            });
            const groupUser = await GroupUser.findOne({
                where: {
                    userId: user?.id,
                    groupId: groupId,
                },
            });
            return groupUser?.role === 'admin';
        }
        catch(error){
            return error;
        }
    }
}

export default GroupUserController;