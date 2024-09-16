import { UnavaiableDayModal } from "../models/unavailable-day";

import { v4 as uuidv4 } from "uuid";

class UnavailableDayService {
  month: number;
  year: number;
  monthDays: Object;
  constructor() {
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    this.monthDays = {
      1: 31,
      2: this.year % 4 === 0 ? 29 : 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
  }
  public createTable = async () => {
    UnavaiableDayModal.sync({ alter: true })
      .then(() => {
        console.log("Skill table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the Skill table:",
          error
        );
      });
  };
  public createUnavaiableDay = async ({
    preferenceId,
    day,
  }: {
    preferenceId: string;
    day: string;
  }) => {
    try {
      if (!preferenceId || !day) {
        return {
          type: "error",
          message: "Please provide all required fields",
        };
      }
      if (!(await this.checkIfUnavaiableDayExists({ day }))) {
        return {
          type: "error",
          message: "Day does not exist",
        };
      }
      const id = uuidv4();
      await UnavaiableDayModal.create({
        id,
        preferenceId,
        day,
      });
      return {
        type: "success",
        message: "Unavaiable day created successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating unavaiable day: " + error,
      };
    }
  };
  private checkIfUnavaiableDayExists = async ({ day }: { day: string }) => {
    try {
      if (this.monthDays[this.month] < parseInt(day)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
}

export { UnavailableDayService };