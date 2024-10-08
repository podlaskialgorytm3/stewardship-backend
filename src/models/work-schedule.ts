import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class WorkScheduleModal extends Model {
  public id!: string;
  public groupUserId!: string;
  public month!: number;
  public year!: number;
  public day!: number;
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
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
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
