import { UnavaiableDayModal } from "../models/unavailable-day";

import { v4 as uuidv4 } from "uuid";

class UnavailableDayService {
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
}

export { UnavailableDayService };
