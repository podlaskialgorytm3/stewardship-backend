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
            await UserModal.create({
                id: id,
                name: userInfo.name,
                img: userInfo.img,
                email: userInfo.email,
                password: await hashedPassword
            });
            return {
                message: "User created successfully!",
                type: "success"
            }
        }
        catch(error){
            return{
                message: "An error occurred while creating the user: " + error,
                type: "error"
            }
        }
    }
    public getUsers = async (name: string) => {
            try{
                const users = await UserModal.findAll({
                    attributes: ['id','name', 'img', 'email']
                })
                return {
                    message: "Users fetched successfully!",
                    type: "success",
                    data: users.filter((user) => user.name.includes(name) && user)
                }
            }
            catch(error){
                return {
                    message: "An error occurred while fetching the users: " + error,
                    type: "error"
                };
            }
        }
    public getUser = async (id: string) => {
        try{
            const user = await UserModal.findByPk(id);
            return {
                message: "User fetched successfully!",
                type: "success",
                data: {
                    id: user?.id,
                    name: user?.name,
                    img: user?.img,
                    email: user?.email,
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while fetching the user: " + error,
                type: "error"
            };
        }
    }
    public getUserByToken = async (token: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    accessToken: token
                }
            });

            if (user) {
                return {
                   
                        id: user.id,
                        name: user.name,
                        img: user.img,
                        email: user.email,
                }
            } else {
                return {
                    message: "User not found",
                    type: "error"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while fetching the user: " + error,
                type: "error"
            };
        }
    }
    public editUser = async (id: string, userInfo: {name: string, img: string}) => {
        try{
            const user = await UserModal.findByPk(id);
            if(user){
                user.name = userInfo.name;
                user.img = userInfo.img;
                await user.save();
            }
            return {
                message: "User updated",
                type: "success"
            }
        }
        catch(error){
            return {
                message: "An error occurred while updating the user: " + error,
                type: "error"
            }
        }
    }
    public deleteUser = async (id: number) => {
        try{
            const user = await UserModal.findByPk(id);
            if(user){
                this.userAuthentication.saveAccessToken(user.email as string, '');
                await user.destroy();
                return {
                    message: "User deleted successfully!",
                    type: "success"
                }
            }

        }
        catch(error){
            return {
                message: "An error occurred while deleting the user: " + error,
                type: "error"
            }
        }
    }
    public changeEmail = async (id: string, email: string, password: string) => {
        try{
            const user = await UserModal.findByPk(id);
            if(user){
                const isPasswordValid = this.userUtils.comparePassword(password, user.password);
                if(await isPasswordValid){
                    user.email = email;
                    await user.save();
                    return {
                        message: "Email updated successfully!",
                        type: "success"
                    }
                }
                else{
                    return {
                        message: "Invalid password",
                        type: "info"
                    }
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while updating the email: " + error,
                type: "error"
            }
        }
    } 
    public isTokenValid = async (token: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    accessToken: token
                }
            });
            if(user){
                return {
                    message: "Token is valid",
                    type: "success",
                    authenticated: true
                }
            }
            else{
                return {
                    message: "Token is invalid",
                    type: "info",
                    authenticated: false
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while validating the token: " + error,
                type: "error"
            }
        }
    }
    public changeImg = async (img: string, token: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    accessToken: token
                }
            });
            if(user){
                user.img = img;
                await user.save();
                return {
                    message: "Image updated successfully!",
                    type: "success"
                }
            }
            else{
                return {
                    message: "User not found",
                    type: "error"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while updating the image: " + error,
                type: "error"
            }
        }
    }
    public changeName = async (name: string, token: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    accessToken: token
                }
            });
            if(user){
                user.name = name;
                await user.save();
                return {
                    message: "Name updated successfully!",
                    type: "success"
                }
            }
            else{
                return {
                    message: "User not found",
                    type: "error"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while updating the name: " + error,
                type: "error"
            }
        }
    }
}

export default UserController;