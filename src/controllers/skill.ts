import { Request, Response } from "express";

import { SkillService } from "../services/skill";

class SkillController {
  private skillService: SkillService;
  constructor() {
    this.skillService = new SkillService();
  }
  public postSkill = async (request: Request, response: Response) => {
    try {
      const { skillName, isRemote, groupId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.skillService.createSkill({
        skillName: skillName as string,
        isRemote: isRemote as unknown as boolean,
        groupId: groupId as string,
        token: token as string,
      });
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { SkillController };
