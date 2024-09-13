import { Request, Response } from "express";

import { ShiftService } from "../services/shift";

class ShiftController {
  private shiftService: ShiftService;
  constructor() {
    this.shiftService = new ShiftService();
  }
  public postShift = async (request: Request, response: Response) => {
    try {
      const {
        groupId,
        nameOfShift,
        startFrom,
        startTo,
        endFrom,
        endTo,
        minDailyHours,
        maxDailyHours,
      } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.shiftService.createShift({
        groupId: groupId as string,
        nameOfShift: nameOfShift as string,
        startFrom: startFrom as string,
        startTo: startTo as string,
        endFrom: endFrom as string,
        endTo: endTo as string,
        minDailyHours: Number(minDailyHours) as number,
        maxDailyHours: Number(maxDailyHours) as number,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { ShiftController };
