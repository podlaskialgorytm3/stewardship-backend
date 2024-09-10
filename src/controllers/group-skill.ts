import { Request, Response } from "express";
import { GroupSkillService } from "../services/group-skill";

class GroupSkillController {
  private groupSkillService: GroupSkillService;
  constructor() {
    this.groupSkillService = new GroupSkillService();
  }
  public postGroupSkill = async (request: Request, response: Response) => {
    try {
      const { groupUserId, skillId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.groupSkillService.addSkillToUser({
        groupUserId: groupUserId as string,
        skillId: skillId as string,
        token: token as string,
      });
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getBelongingSkills = async (request: Request, response: Response) => {
    try {
      const { groupId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.groupSkillService.getBelongingSkills({
        token: token as string,
        groupId: groupId as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getNotBelongingSkills = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.groupSkillService.getNotBelongingSkills({
        token: token as string,
        groupId: groupId as string,
      });
      response.status(200).json(result);
    } catch (error) {
      return response.status(400).json(error);
    }
  };
}

export { GroupSkillController };
