import UserModal from '../models/user';
import UserInterface from '../types/user';
import UserUtils from '../utils/user';
import { v4 as uuidv4 } from 'uuid';

class UserController {
    public userUtils = new UserUtils();
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
        const hashedPassword = this.userUtils.hashPassword(userInfo.password);
        try{
            const newUser = await UserModal.create({
                id: id,
                name: userInfo.name,
                img: userInfo.img,
                email: userInfo.email,
                password: await hashedPassword
            });
            console.log("New user created: ", newUser);
        }
        catch(error){
            console.error("An error occurred while creating a new user: ", error);
        }
    }
    public getUsers = async () => {
            try{
                const users = await UserModal.findAll({
                    attributes: ['id','name', 'img', 'email']
                })
                return users;
            }
            catch(error){
                return error;
            }
        }
    public authonticateUser = async (email: string, password: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    email: email
                }
            });
            if(user){
                const isPasswordValid: boolean = await this.userUtils.comparePassword(password, user.password);
                if(isPasswordValid){
                    return user;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(error){
            return error;
        }
    }

    
}

export default UserController;