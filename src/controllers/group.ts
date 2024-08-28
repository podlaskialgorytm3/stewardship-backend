import { Request, Response } from "express";

import GroupService from "../services/group";
import UserService from "../services/user";

const userService = new UserService();
const groupService = new GroupService();

class GroupController {
  public postGroup = async (request: Request, response: Response) => {
    try {
      const { name, category } = request.body;
      const user = await userService.getUserByToken(
        request.headers["authorization"]?.split(" ")[1] as string
      );
      const result = await groupService.createGroup(
        name as string,
        category as string,
        user?.id as string
      );
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getGroup = async (request: Request, response: Response) => {
    try {
      const id = request.params.id;
      const result = await groupService.getGroup(id);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putGroup = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const id = request.params.id;
      const { name, category } = request.body;
      const result = await groupService.editGroup(
        id,
        name as string,
        category as string,
        token as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteGroup = async (request: Request, response: Response) => {
    try {
      const user = await userService.getUserByToken(
        request.headers["authorization"]?.split(" ")[1] as string
      );
      const id = request.params.id;
      const result = await groupService.deleteGroup(id, user?.id as string);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getSearchGroup = async (request: Request, response: Response) => {
    try {
      const name = request.params.name;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await groupService.getGroupsByName(name, token);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default GroupController;
