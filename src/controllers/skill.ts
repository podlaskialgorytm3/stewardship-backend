import { Request, Response } from "express";

import { SkillService } from "../services/skill";

class SkillController {
  private skillService: SkillService;
  constructor() {
    this.skillService = new SkillService();
  }
  public postSkill = async (request: Request, response: Response) => {
    try {
      const { skillName, isRemote, groupId } = request.body;
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
  public getSkills = async (request: Request, response: Response) => {
    try {
      const { groupId } = request.query;
      const result = await this.skillService.getSkills({
        groupId: groupId as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteSkill = async (request: Request, response: Response) => {
    try {
      const { skillId, groupId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.skillService.deleteSkill({
        skillId: skillId as string,
        groupId: groupId as string,
        token: token as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { SkillController };
