import { AppConfig } from "./types/config";
import databaseConfig from "./database";

export const appConfig: AppConfig = {
    port: parseInt(process.env.APP_PORT || '3000'),
    database: databaseConfig
};
