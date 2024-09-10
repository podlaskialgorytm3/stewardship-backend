import { ScheduleRuleModal } from "../models/schedule-rule";

class ScheduleRuleService {
  public createTable = async () => {
    ScheduleRuleModal.sync({ alter: true })
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

export { ScheduleRuleService };
