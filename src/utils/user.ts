import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserUtils {
    public hashPassword = (password: string) => {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hash(password, saltRounds);
        return hashedPassword;  
    }
    public comparePassword = async (password: string, hashedPassword: string) => {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    } 
    public generateToken = (email: string) => {
        const token =  jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '10m'});
        return token;
    }
}

export default UserUtils;