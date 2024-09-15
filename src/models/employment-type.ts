import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class EmploymentTypeModal extends Model {
  public id!: string;
  public employmentName!: string;
  public workingHours!: number;
}

EmploymentTypeModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    employmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workingHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "employment_types",
    sequelize,
  }
);

export { EmploymentTypeModal };
