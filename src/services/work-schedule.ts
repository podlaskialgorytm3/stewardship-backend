import { WorkScheduleModal } from "../models/work-schedule";

class WorkScheduleService {
  public createTable = async () => {
    WorkScheduleModal.sync({ alter: true })
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

export { WorkScheduleService };
