import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class GroupUser extends Model {
  public id!: string;
  public role!: string;
  public userId!: string;
  public groupId!: string;
  public position!: string;
  public scheduleRuleId!: string;
}

GroupUser.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduleRuleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "group_users",
    sequelize,
  }
);

export default GroupUser;
