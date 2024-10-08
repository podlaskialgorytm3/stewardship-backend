import { Request, Response, NextFunction } from "express";
import { Payload } from "./types/auth";

import UserModal from "../models/user";
import UserUtils from "../utils/user";
import jwt, { VerifyErrors } from "jsonwebtoken";

class UserAuthentication {
  public userUtils = new UserUtils();
  public authonticateUser = async (email: string, password: string) => {
    try {
      const user = await UserModal.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        const isPasswordValid: boolean = await this.userUtils.comparePassword(
          password,
          user.password
        );
        if (isPasswordValid) {
          const token = this.userUtils.generateToken(email);
          this.saveAccessToken(email, token);
          return token;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      return error;
    }
  };
  public saveAccessToken = async (email: string, saveAccessToken: string) => {
    try {
      const user = await UserModal.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        user.accessToken = saveAccessToken;
        await user.save();
      }
    } catch (error) {
      return {
        message: "An error occurred while saving the access token: " + error,
        type: "error",
      };
    }
  };
  public logout = async ({ token }: { token: string }) => {
    try {
      const user = await UserModal.findOne({
        where: {
          accessToken: token,
        },
      });
      if (user) {
        user.accessToken = null;
        await user.save();
        return {
          message: "Logged out successfully",
          type: "success",
        };
      } else {
        return {
          message: "User not found",
          type: "error",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while logging out: " + error,
        type: "error",
      };
    }
  };
  public authMiddleware = (
    request: Request,
    resposne: Response,
    next: NextFunction
  ) => {
    const token = request.headers["authorization"]?.split(" ")[1] as string;
    if (!token) {
      return resposne.status(401).json({
        message: "No token provided",
      });
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (error: VerifyErrors | null, user: Payload | any) => {
        if (error) {
          return resposne.status(403).json({
            message: "Failed to authenticate token",
            error: error.message,
          });
        }
        request.body.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          img: user.img,
          iat: new Date(parseInt(user.iat) * 1000 + 60 * 60 * 1000 * 2),
          exp: new Date(parseInt(user.exp) * 1000 + 60 * 60 * 1000 * 2),
        };
        next();
      }
    );
  };
}

export default UserAuthentication;
