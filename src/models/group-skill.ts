import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class GroupSkillModal extends Model {
  public id!: string;
  public groupId!: string;
  public skillName!: string;
  public isRemote!: boolean;
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
