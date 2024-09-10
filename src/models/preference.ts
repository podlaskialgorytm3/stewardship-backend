import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class PreferenceModal extends Model {
  public id!: string;
  public mounthYear!: string;
  public groupUserId!: string;
  public shiftId!: string;
  public preferedDays!: string;
  public employmentType!: string;
}

PreferenceModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    mounthYear: {
      type: DataTypes.STRING,
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
    employmentType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "full-time",
    },
  },
  {
    tableName: "preferences",
    sequelize,
  }
);

export { PreferenceModal };
