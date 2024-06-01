import Group from "../models/group";

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
}

export default GroupController;