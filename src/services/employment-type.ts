import { EmploymentTypeModal } from "../models/employment-type";

class EmploymentTypeService {
  public createTable = async () => {
    EmploymentTypeModal.sync({ alter: true })
      .then(() => {
        console.log("EmploymentType table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the EmploymentType table:",
          error
        );
      });
  };
}

export { EmploymentTypeService };
