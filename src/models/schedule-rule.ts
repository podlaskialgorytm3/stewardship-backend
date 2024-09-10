import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class ScheduleRuleModal extends Model {
  public id!: string;
  public groupId!: string;
  public scheduleRoleName!: string;
  public maxDailyHours!: number;
  public maxWeeklyHours!: number;
  public maxRestBeetwenShifs!: number;
  public maxWeeklyRest!: number;
}

ScheduleRuleModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scheduleRoleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxDailyHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxWeeklyHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxRestBeetwenShifs: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxWeeklyRest: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "schedule_rules",
    sequelize,
  }
);

export { ScheduleRuleModal };
