import { PreferenceModal } from "../models/preference";

class PreferenceService {
  public createTable = async () => {
    PreferenceModal.sync({ alter: true })
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

export { PreferenceService };
