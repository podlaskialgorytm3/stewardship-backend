import { Request, Response } from "express";

import { UnavailableDayService } from "../services/unavailable-day";

class UnavailableDayController {
  unavailableDayService: UnavailableDayService;
  constructor() {
    this.unavailableDayService = new UnavailableDayService();
  }
  public postUnavaiableDay = async (request: Request, response: Response) => {
    try {
      const { preferenceId, day } = request.query;
      const result = await this.unavailableDayService.createUnavaiableDay({
        preferenceId: preferenceId as string,
        day: Number(day) as number,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteUnavailableDay = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { unavialableDayId } = request.params;
      const result = await this.unavailableDayService.deleteUnavailableDay({
        unavialableDayId: unavialableDayId as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getUnavailableDays = async (request: Request, response: Response) => {
    try {
      const { preferenceId } = request.query;
      const result =
        await this.unavailableDayService.getUnavailableDaysByPreferenceId({
          preferenceId: preferenceId as string,
        });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { UnavailableDayController };
