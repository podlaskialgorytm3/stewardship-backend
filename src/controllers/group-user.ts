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
}

export default GroupUserController;