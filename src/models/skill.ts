import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class SkillModal extends Model {
  public id!: string;
  public groupId!: string;
  public skillName!: string;
  public isRemote!: boolean;
}

SkillModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skillName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRemote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "skills",
    sequelize,
  }
);

export { SkillModal };
