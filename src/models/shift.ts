import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class ShiftModal extends Model {
  public id!: string;
  public groupId!: string;
  public nameOfShift!: string;
  public startFrom!: string;
  public startTo!: string;
  public endFrom!: string;
  public endTo!: string;
  public maxDailyHours!: number;
  public minDailyHours!: number;
}

ShiftModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameOfShift: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startFrom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endFrom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxDailyHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minDailyHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "shifts",
    sequelize,
  }
);

export { ShiftModal };
