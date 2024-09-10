import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class WorkScheduleModal extends Model {
  public id!: string;
  public groupUserId!: string;
  public monthYear!: string;
  public day!: string;
  public isWorkingDay!: boolean;
  public start!: string;
  public end!: string;
}

WorkScheduleModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isWorkingDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    start: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "work_schedule",
    sequelize,
  }
);

export { WorkScheduleModal };
