import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class DayRestrictionModal extends Model {
  public id!: string;
  public scheduleRuleId!: string;
  public dayOfWeek!: string;
  public maxFollowingDay!: string;
}

DayRestrictionModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    scheduleRuleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxFollowingDay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "day_restrictions",
    sequelize,
  }
);

export { DayRestrictionModal };
