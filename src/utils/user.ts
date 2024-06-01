import bcrypt from 'bcrypt';

class UserUtils {
    public hashPassword = async (password: string) => {
        const saltRounds = 10;
        try{
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        }
        catch(error){
            console.error("An error occurred while hashing the password: ", error);
            throw error;
        }
    }
}

export default UserUtils;