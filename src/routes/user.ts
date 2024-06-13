import { Request, Response } from 'express';
import express from 'express';
import UserController  from '../controllers/user';
import UserAuthentication from '../middlewares/auth';
import ResetPassword from '../services/user/reset-password';
import UserInterFace from '../types/user';

const userController = new UserController;
const userAuthentication = new UserAuthentication;
const resetPassword = new ResetPassword;

const router = express.Router();

router.post('/user', (request: Request, response: Response) => {
    const {name, img, email, password} = request.query;
    const userInfo: UserInterFace = {
        name: name as string,
        img: img as string,
        email: email as string,
        password: password as string
    } 
    userController.createUser(userInfo);
    response.status(201).json({
        message: 'User created successfully',
        user: {}
    });
})
router.get('/user', async (request: Request, response: Response)  => {
    const users = await userController.getUsers();
    response.status(200).json({
        message: 'Users fetched successfully!',
        data: users
    });
})
router.get(`/user/:id`, userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    console.log(userAuthentication.authMiddleware)
    const id = request.params.id;
    const user = await userController.getUser(id);
    response.status(200).json({
        message: 'Your data fetched successfully!',
        data: user
    });
})
router.put(`/user/:id`, userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const id = request.params.id;
    const {name, img } = request.query;
    const userData = {
        name: name as string,
        img: img as string,
    }
    userController.editUser(id, userData);
    response.status(200).json({
        message: 'User updated successfully!'
    });
})
router.post('/user/login', async (request: Request, response: Response) => {
    const {email, password} = request.query;
    const token = await userAuthentication.authonticateUser(email as string, password as string);
    if(token){
        response.status(200).json({
            message: 'User authenticated successfully!',
            token: token
        });
    }
    else{
        response.status(401).json({
            message: 'User not authenticated'
        });
    }
})
router.delete(`/user/:id`, userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const id = request.params.id;
    userController.deleteUser(parseInt(id));
    response.status(200).json({
        message: 'User deleted successfully!'
    });
})
router.put('/user/email/change', userAuthentication.authMiddleware, async (request: Request, resposne: Response) => {
    const { id, email, password } = request.query;
    const responseText = await userController.changeEmail(id as string, email as string, password as string);
    resposne.status(200).json({
        message: responseText
    });
})
router.post('/user/password/reset', async (request: Request, response: Response) => {
    const { email } = request.query;
    const responseText = await resetPassword.sendLinkToResetPassword(email as string);
    response.status(200).json({
        message: responseText
    });
})
router.put('/user/password/change', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { newPassword, token } = request.query;
    const responseText = await resetPassword.resetPassword(newPassword as string, token as string);
    response.status(200).json({
        message: responseText
    });
})
router.post('/user/logout', async (request: Request, response: Response) => {
    const {email} = request.query;
    userAuthentication.saveAccessToken(email as string, '');
    response.status(200).json({
        message: 'User logged out successfully'
    });
})
router.get('/user/auth', userAuthentication.authMiddleware, async (request: Request, response: Response) => { // router for testing
    response.status(200).json({
        message: 'User authenticated successfully',
    });
})

export default router;