import { SkillModal } from "../models/skill";

class SkillService {
  public createTable = async () => {
    SkillModal.sync({ alter: true })
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

export { SkillService };
