import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class PreferenceModal extends Model {
  public id!: string;
  public month!: number;
  public year!: number;
  public groupUserId!: string;
  public shiftId!: string;
  public preferedDays!: string;
  public employmenTypeId!: string;
}

PreferenceModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shiftId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferedDays: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "mixed",
    },
    employmenTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "preferences",
    sequelize,
  }
);

export { PreferenceModal };
