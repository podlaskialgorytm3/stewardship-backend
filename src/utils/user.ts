import bcrypt from 'bcrypt';

class UserUtils {
    public hashPassword = (password: string) => {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hash(password, saltRounds);
        return hashedPassword;
        
    }
}

export default UserUtils;