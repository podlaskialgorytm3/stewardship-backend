import { Request, Response } from "express";

import { PreferenceService } from "../services/preference";

class PreferenceController {
  preferenceService: PreferenceService;
  constructor() {
    this.preferenceService = new PreferenceService();
  }
  public postPreference = async (request: Request, response: Response) => {
    try {
      const { groupId, shiftId, preferedDays, employmentTypeId } =
        request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.preferenceService.createPreference({
        groupId,
        shiftId,
        preferedDays,
        employmentTypeId,
        token,
      } as {
        groupId: string;
        shiftId: string;
        preferedDays: string;
        employmentTypeId: string;
        token: string;
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getPreferences = async (request: Request, response: Response) => {
    try {
      const groupId = request.query.groupId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.preferenceService.getPreferences({
        groupId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getPreference = async (request: Request, response: Response) => {
    try {
      const groupUserId = request.params.groupUserId as string;
      const { groupId, month, year } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.preferenceService.getPreference({
        groupId: groupId as string,
        groupUserId: groupUserId as string,
        token,
        month: Number(month),
        year: Number(year),
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { PreferenceController };
