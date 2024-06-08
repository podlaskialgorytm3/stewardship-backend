import bcrypt from 'bcrypt';

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
}

export default UserUtils;