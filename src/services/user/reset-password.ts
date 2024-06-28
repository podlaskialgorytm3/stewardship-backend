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
            console.log(user)
            if(user){
                const token = this.userUtils.generateToken(email);
                await this.sendMail.sendMail(
                    email,
                    'Password Reset Link',
                    `Click on the link to reset your password: ${process.env.URL}/reset-password/${token}`
                );
                this.updateResetToken(email, token);
                return {
                    message: "Password reset link sent successfully!",
                    type: "success"
                }
            }
            else{
                return {
                    message: "User not found!",
                    type: "error"
                }
            }  
        }
        catch(error){
            return {
                message: "An error occurred while sending the password reset link: " + error,
                type: "error"
            }
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
                return {
                    message: "Password reset successfully!",
                    type: "success"
                }
            }
            else{
                return {
                    message: "User not found or your token is invalid!",
                    type: "error"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while resetting the password: " + error,
                type: "error"
            }
        }
    }
}

export default ResetPassword;