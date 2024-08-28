import { Request, Response } from "express";

import ResetPassword from "../services/user/reset-password";

import UserInterFace from "../types/user";

import UserService from "../services/user";

import UserAuthentication from "../middlewares/auth";

const resetPassword = new ResetPassword();
const userService = new UserService();
const userAuthentication = new UserAuthentication();

class UserController {
  public postUser = async (request: Request, response: Response) => {
    try {
      const { name, img, email, password } = request.body;
      const userInfo: UserInterFace = {
        name: name as string,
        img: img as string,
        email: email as string,
        password: password as string,
      };
      const result = await userService.createUser(userInfo);
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getUser = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await userService.getUserByToken(token);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getUserLogin = async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const token = await userAuthentication.authonticateUser(
        email as string,
        password as string
      );
      if (token) {
        response.status(200).json({
          message: "User authenticated successfully!",
          type: "success",
          token: token,
          user: await userService.getUserByToken(String(token)),
        });
      } else {
        response.status(401).json({
          message: "User not authenticated",
          type: "error",
        });
      }
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getUserById = async (request: Request, response: Response) => {
    try {
      const id = request.params.id;
      const result = userService.deleteUser(id);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putEmailChange = async (request: Request, resposne: Response) => {
    try {
      const { email, password } = request.body;
      const token = request.headers["authorization"]?.split(" ")[1];
      const result = await userService.changeEmail(
        token as string,
        email as string,
        password as string
      );
      resposne.status(200).json(result);
    } catch (error) {
      resposne.status(400).json(error);
    }
  };
  public postPasswordReset = async (request: Request, response: Response) => {
    try {
      const { email } = request.body;
      const result = await resetPassword.sendLinkToResetPassword(
        email as string
      );
      response.status(200).json(result);
    } catch (erorr) {
      response.status(400).json(erorr);
    }
  };
  public putPasswordReset = async (request: Request, response: Response) => {
    try {
      const { newPassword, resetPasswordToken } = request.body;
      const result = await resetPassword.resetPassword(
        newPassword as string,
        resetPasswordToken as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public postUserLogout = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      userAuthentication.logout({ token });
      response.status(200).json({
        message: "User logged out successfully",
        type: "success",
      });
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getIfTokenIsValid = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1];
      const result = await userService.isTokenValid(token as string);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putImgChange = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1];
      const { img } = request.body;
      const result = await userService.changeImg(
        img as string,
        token as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putNameChange = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1];
      const { name } = request.body;
      const result = await userService.changeName(
        name as string,
        token as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putPasswordChange = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1];
      const { oldPassword, newPassword } = request.body;
      const result = await userService.changePassword(
        oldPassword as string,
        newPassword as string,
        token as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default UserController;
