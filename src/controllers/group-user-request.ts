import { Request, Response } from "express";

import GroupUserRequestService from "../services/group-user-request";
import UserService from "../services/user";
import GroupUserService from "../services/group-user";

const userService = new UserService();
const groupUserService = new GroupUserService();
const groupUserRequestService = new GroupUserRequestService();

class GroupUserRequestController {
  public postGroupUserRequest = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId } = request.body;
      const user = await userService.getUserByToken(
        request.headers["authorization"]?.split(" ")[1] as string
      );
      const result = await groupUserRequestService.addRequest(
        user?.id as string,
        groupId as string
      );
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getGroupUserRequest = async (request: Request, response: Response) => {
    try {
      const { groupId, username } = request.query;
      const result = await groupUserRequestService.getRequests(
        groupId as string,
        username as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getNotAddedUsers = async (request: Request, response: Response) => {
    try {
      const { groupId, username } = request.query;
      const result = await groupUserRequestService.getNotAddedUsers(
        groupId as string,
        username as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putGroupUserRequest = async (request: Request, response: Response) => {
    try {
      const { groupId, userId, status } = request.body;
      const groupUser = (await groupUserService.getUserByTokenGroup(
        request.headers["authorization"]?.split(" ")[1] as string,
        groupId as string
      )) as { id: number; role: string };
      const result = await groupUserRequestService.changeStatus(
        groupId as string,
        userId as string,
        status as string,
        groupUser.role as string
      );
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteGroupUserRequest = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId } = request.params;
      const user = (await userService.getUserByToken(
        request.headers["authorization"]?.split(" ")[1] as string
      )) as { id: string };
      const result = groupUserRequestService.deleteRequest(
        groupId as string,
        user.id as string
      );
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default GroupUserRequestController;
