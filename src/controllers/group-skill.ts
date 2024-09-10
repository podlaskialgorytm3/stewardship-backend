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
}

export { GroupSkillController };
