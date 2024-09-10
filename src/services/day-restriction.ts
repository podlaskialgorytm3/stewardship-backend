import { DayRestrictionModal } from "../models/day-restriction";

class DayRestrictionService {
  public createTable = async () => {
    DayRestrictionModal.sync({ alter: true })
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
}

export { DayRestrictionService };
