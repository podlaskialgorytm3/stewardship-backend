import GroupUserRequest from '../models/group-user-request';

class GroupUserRequestController {
    public createTable = async () => {
        GroupUserRequest.sync({ alter: true })
            .then(() => {
                console.log('GroupUserRequest table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the GroupUserRequest table:', error);
            });
    }
}

export default GroupUserRequestController;