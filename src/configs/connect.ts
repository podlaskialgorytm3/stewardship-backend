import { Sequelize } from "sequelize";
import databaseConfig from "../configs/database";

export const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    dialect: "mysql",
  }
);
