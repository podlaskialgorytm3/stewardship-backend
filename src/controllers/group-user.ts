import { Request, Response } from "express";

import GroupUserService from "../services/group-user";
import UserService from "../services/user";

const groupUserService = new GroupUserService();
const userService = new UserService();

class GroupUserController {
  public getGroupUser = async (request: Request, response: Response) => {
    try {
      const { groupId, username } = request.query;
      const result = await groupUserService.getUsers(
        groupId as string,
        username as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getGroupUserWithoutCreator = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId, username } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await groupUserService.getUsersWithoutCreator(
        groupId as string,
        username as string,
        token as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteGroupUser = async (request: Request, response: Response) => {
    try {
      const { groupId, memberId } = request.query;
      const groupUser = (await groupUserService.getUserByTokenGroup(
        request.headers["authorization"]?.split(" ")[1] as string,
        groupId as string
      )) as { id: number; role: string };
      const result = await groupUserService.deleteGroupUser(
        memberId as string,
        groupUser.role,
        groupId as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putGroupUser = async (request: Request, response: Response) => {
    try {
      const { groupId, userId } = request.body;
      const groupUser = (await groupUserService.getUserByTokenGroup(
        request.headers["authorization"]?.split(" ")[1] as string,
        groupId as string
      )) as { id: number; role: string };
      const result = await groupUserService.changeRole(
        groupId as string,
        userId as string,
        groupUser.role
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public postGroupUserInvite = async (request: Request, response: Response) => {
    try {
      const { groupId, userId } = request.body;
      const groupUser = (await groupUserService.getUserByTokenGroup(
        request.headers["authorization"]?.split(" ")[1] as string,
        groupId as string
      )) as { id: number; role: string };
      const result = await groupUserService.addUser(
        userId as string,
        "member",
        groupId as string,
        groupUser.role as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getIsMember = async (request: Request, response: Response) => {
    try {
      const groupId = request.params.groupId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const userId = await userService.getUserIdByToken(token);
      const result = await groupUserService.isMemberOfGroup(
        groupId as string,
        userId as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getIsAdmin = async (request: Request, response: Response) => {
    try {
      const groupId = request.params.groupId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await groupUserService.isAdminOfGroup({
        groupId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putPosition = async (request: Request, response: Response) => {
    try {
      const { groupUserId, position } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await groupUserService.updatePosition({
        position,
        groupUserId,
        token,
      } as { position: string; groupUserId: string; token: string });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };

  public putScheduleRule = async (request: Request, response: Response) => {
    try {
      const { groupUserId, scheduleRuleId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await groupUserService.updateScheduleRule({
        scheduleRuleId: scheduleRuleId as string,
        groupUserId: groupUserId as string,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default GroupUserController;
