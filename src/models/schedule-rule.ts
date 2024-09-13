import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class ScheduleRuleModal extends Model {
  public id!: string;
  public groupId!: string;
  public scheduleRuleName!: string;
  public maxDailyHours!: number;
  public maxWeeklyHours!: number;
  public minRestBeetwenShifts!: number;
  public minWeeklyRest!: number;
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
    scheduleRuleName: {
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
    minRestBeetwenShifts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minWeeklyRest: {
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
