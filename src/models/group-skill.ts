import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class GroupSkillModal extends Model {
  public id!: string;
  public groupUserId!: string;
  public skillId!: string;
}

GroupSkillModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skillId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "group_skills",
    sequelize,
  }
);

export { GroupSkillModal };
