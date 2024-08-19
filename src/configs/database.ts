import { DatabaseConfig } from "./types/config";
require("dotenv").config();

const databaseConfig: DatabaseConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT ?? "3000"),
  username: process.env.DATABASE_USERNAME || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "custom_database",
};

export default databaseConfig;
