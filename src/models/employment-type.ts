import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class EmploymentTypeModal extends Model {
  public id!: string;
  public groupId!: string;
  public employmentName!: string;
  public workingHours!: number;
}

EmploymentTypeModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
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
