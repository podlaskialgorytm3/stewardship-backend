import nodemailer from 'nodemailer';

class SendMail {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_MAILER_EMAIL,
            pass: process.env.NODE_MAILER_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
    })
    public sendMail = async (email: string, subject: string, text: string) => {
        try{
            const mailOptions = {
                from: 'stewardship@gmail.com',
                to: email,
                subject: subject,
                text: text,

            }
            this.transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    return error;
                }
                else{
                    return "Email sent successfully! " + info.response;
                }
            })
        }
        catch(error){
            return "An error occurred while sending the email: " + error;
        }
    }
}

export default SendMail;