import { Request, Response } from "express";

import { PreferenceService } from "../services/preference";

class PreferenceController {
  preferenceService: PreferenceService;
  month: number;
  year: number;
  constructor() {
    this.preferenceService = new PreferenceService();
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
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
      const { groupId, month, year } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.preferenceService.getPreferences({
        groupId: groupId as string,
        token,
        month: Number(month) || this.month,
        year: Number(year) || this.year,
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
        month: Number(month) || this.month,
        year: Number(year) || this.year,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putPreference = async (request: Request, response: Response) => {
    try {
      const { groupId, preferenceId, shiftId, preferedDays, employmentTypeId } =
        request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.preferenceService.updatePreference({
        groupId: groupId as string,
        preferenceId: preferenceId as string,
        shiftId: shiftId as string,
        preferedDays: preferedDays as string,
        employmentTypeId: employmentTypeId as string,
        token: token as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { PreferenceController };
