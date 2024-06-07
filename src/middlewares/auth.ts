import UserModal from '../models/user';
import UserUtils from '../utils/user';
import jwt from 'jsonwebtoken';

class UserAuthentication {
    public userUtils = new UserUtils();
    public authonticateUser = async (email: string, password: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    email: email
                }
                
            });
            if (user) {
                const isPasswordValid: boolean = await this.userUtils.comparePassword(password, user.password);
                if (isPasswordValid) {
                    const payload = user.toJSON();
                    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string);
                    return token;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        catch(error){
            return error;
        }
    }
}

export default UserAuthentication;