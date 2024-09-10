import { GroupSkillModal } from "../models/group-skill";

class GroupSkillService {
  public createTable = async () => {
    GroupSkillModal.sync({ alter: true })
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

export { GroupSkillService };
