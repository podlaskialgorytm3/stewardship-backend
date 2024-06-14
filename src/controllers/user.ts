import UserModal from '../models/user';
import UserInterface from '../types/user';
import UserUtils from '../utils/user';
import UserAuthentication from '../middlewares/auth';
import SendMail from '../services/user/send-mail';
import { v4 as uuidv4 } from 'uuid';

class UserController {
    public userUtils = new UserUtils();
    public userAuthentication = new UserAuthentication();
    public sendMail = new SendMail();
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
    public getUser = async (id: string) => {
        try{
            const user = await UserModal.findByPk(id);
            return {
                id: user?.id,
                name: user?.name,
                img: user?.img,
                email: user?.email,
            };
        }
        catch(error){
            return error;
        }
    }
    public getUserByToken = async (token: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    accessToken: token
                }
            });
            return {
                id: user?.id,
            };
        }
        catch(error){
            return error;
        }
    }
    public editUser = async (id: string, userInfo: {name: string, img: string}) => {
        try{
            const user = await UserModal.findByPk(id);
            if(user){
                user.name = userInfo.name;
                user.img = userInfo.img;
                await user.save();
                console.log("User updated: ", user);
            }
        }
        catch(error){
            console.error("An error occurred while updating the user: ", error);
        }
    }
    public deleteUser = async (id: number) => {
        try{
            const user = await UserModal.findByPk(id);
            if(user){
                this.userAuthentication.saveAccessToken(user.email as string, '');
                await user.destroy();
                console.log("User deleted: ", user);
            }

        }
        catch(error){
            console.error("An error occurred while deleting the user: ", error);
        }
    }
    public changeEmail = async (id: string, email: string, password: string) => {
        try{
            const user = await UserModal.findByPk(id);
            if(user){
                const isPasswordValid = this.userUtils.comparePassword(password, user.password);
                if(await isPasswordValid){
                    user.email = email;
                    console.log(email)
                    await user.save();
                    return "Email updated successfully!"
                }
                else{
                    return "Invalid password!";
                }
            }
        }
        catch(error){
            return "An error occurred while updating the email: " + error;
        }
    } 
}

export default UserController;