import UserModal  from '../../models/user';
import UserUtils from '../../utils/user';
import SendMail from './send-mail';

class ResetPassword {
    private userUtils = new UserUtils();
    private sendMail = new SendMail();
    private updateResetToken = (email: string, token: string) => {
        UserModal.update(
            { resetToken: token },
            {
                where: {
                    email: email
                }
            }
        );
    }
    public sendLinkToResetPassword = async (email: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    email: email
                }
            });
            if(user){
                const token = this.userUtils.generateToken(email);
                await this.sendMail.sendMail(
                    email,
                    'Password Reset Link',
                    `Click on the link to reset your password: ${process.env.URL}/reset-password/${token}`
                );
                this.updateResetToken(email, token);
                return "Password reset link sent successfully!";
            }
            else{
                return "User not found!";
            }  
        }
        catch(error){
            return "An error occurred while sending the email: " + error;
        }
    }
    public resetPassword = async (newPassword: string, token: string) => {
        try{
            const user = await UserModal.findOne({
                where: {
                    resetToken: token
                }
            });
            if(user){
                user.password = await this.userUtils.hashPassword(newPassword);
                await user.save();
                return "Password reset successfully!";
            }
            else{
                return "User not found!";
            }
        }
        catch(error){
            return "An error occurred while resetting the password: " + error;
        }
    }
}

export default ResetPassword;