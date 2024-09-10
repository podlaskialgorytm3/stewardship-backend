import { UnavaiableDayModal } from "../models/unavaiable-day";

class UnavaiableDayService {
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
}

export { UnavaiableDayService };
