import Group from "../models/group";
import { v4 as uuidv4 } from 'uuid';

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
    public createGroup = async (name: string, category: string) => {
        try {
            await Group.create({
                id: uuidv4(),
                name,
                category,
            });
            return "Group created successfully";
        } catch (error) {
            return "An error occurred while creating the group: " + error;
        }
    }
}

export default GroupController;