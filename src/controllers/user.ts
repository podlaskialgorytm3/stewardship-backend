import User from '../models/user';

class UserController {
    public createTable = async () => {
        User.sync({ alter: true })
            .then(() => {
                console.log('User table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the User table:', error);
            });
    }
}

export default UserController;