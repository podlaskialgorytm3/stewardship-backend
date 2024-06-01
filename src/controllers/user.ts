import UserModal from '../models/user';
import UserInterface from '../types/user';
import UserUtils from '../utils/user';
import { v4 as uuidv4 } from 'uuid';

class UserController {
    public createTable = async () => {
        UserModal.sync({ alter: true })
            .then(() => {
                console.log('User table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the User table:', error);
            });
    }
    public createUser = async (userInfo: UserInterface) => {
        const id = uuidv4();
        const hashedPassword = new UserUtils().hashPassword(userInfo.password);
        try{
            const newUser = await UserModal.create({
                id: id,
                name: userInfo.name,
                email: userInfo.email,
                password: await hashedPassword
            });
            console.log("New user created: ", newUser);
        }
        catch(error){
            console.error("An error occurred while creating a new user: ", error);
        }
    }
}

export default UserController;