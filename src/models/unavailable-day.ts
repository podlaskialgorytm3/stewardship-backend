import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/connect";

class UnavaiableDayModal extends Model {
  public id!: string;
  public preferenceId!: string;
  public day!: number;
}

UnavaiableDayModal.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    preferenceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "unavailable_days",
    sequelize,
  }
);

export { UnavaiableDayModal };
