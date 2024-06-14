import GroupUser from "../models/group-user";
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
            const user = await GroupUser.findOne({
                where: {
                    groupId,
                    userId,
                },
            });
            return {
                id: user?.id as number,
                groupId: user?.groupId as number,
                userId: user?.userId as number,
                role: user?.role as string,
            };
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
}

export default GroupUserController;