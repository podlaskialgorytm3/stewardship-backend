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

router.post('/user', async (request: Request, response: Response) => {
    try{
        const {name, img, email, password} = request.body;
        const userInfo: UserInterFace = {
            name: name as string,
            img: img as string,
            email: email as string,
            password: password as string
        } 
        const result = await userController.createUser(userInfo);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})
router.get('/user', async (request: Request, response: Response)  => {
    try{
        const name = request.query.name as string;
        const result = await userController.getUsers(name);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get(`/user/:token`, userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const token = request.params.token;
        const result = await userController.getUserByToken(token);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put(`/user/:id`, userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const id = request.params.id;
        const {name, img } = request.query;
        const userData = {
            name: name as string,
            img: img as string,
        }
        const result = await userController.editUser(id, userData);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.post('/user/login', async (request: Request, response: Response) => {
    try{
        const {email, password} = request.body;
        const token = await userAuthentication.authonticateUser(email as string, password as string);
        if(token){
            response.status(200).json({
                message: 'User authenticated successfully!',
                type: 'success',
                token: token,
                user: await userController.getUserByToken(String(token))
            });
        }
        else{
            response.status(401).json({
                message: 'User not authenticated',
                type: 'error'
            });
        }
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.delete(`/user/:id`, userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const id = request.params.id;
        const result = userController.deleteUser(parseInt(id));
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/user/email/change', userAuthentication.authMiddleware, async (request: Request, resposne: Response) => {
    try{
        const { email, password } = request.body;
        const token = request.headers['authorization']?.split(' ')[1];
        const result = await userController.changeEmail(token as string, email as string, password as string);
        resposne.status(200).json(result);
    }
    catch(error){
        resposne.status(400).json(error);
    }
})
router.post('/user/password/reset', async (request: Request, response: Response) => {
    try{
        const { email } = request.body;
        console.log(email)
        const result = await resetPassword.sendLinkToResetPassword(email as string);
        response.status(200).json(result);
    }
    catch(erorr){
        response.status(400).json(erorr);
    }
})
router.put('/user/password/reset', async (request: Request, response: Response) => {
    try{
        const { newPassword, token } = request.body;
        const result = await resetPassword.resetPassword(newPassword as string, token as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.post('/user/logout', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const {email} = request.query;
        userAuthentication.saveAccessToken(email as string, '');
        response.status(200).json({
            message: 'User logged out successfully',
            type: 'success'
        });
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/user/token/validate', async (request: Request, response: Response) => {
    try{
        const token = request.headers['authorization']?.split(' ')[1];
        console.log("Token: ", token)
        const result = await userController.isTokenValid(token as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/user/img/change', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const token = request.headers['authorization']?.split(' ')[1];
        const {img} = request.body;
        const result = await userController.changeImg(img as string, token as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/user/name/change', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const token = request.headers['authorization']?.split(' ')[1];
        const {name} = request.body;
        const result = await userController.changeName(name as string, token as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/user/password/change', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const token = request.headers['authorization']?.split(' ')[1];
        const {oldPassword, newPassword} = request.body;
        const result = await userController.changePassword(oldPassword as string, newPassword as string, token as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

export default router;