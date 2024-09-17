import express from "express";
import cors from "cors";
import { appConfig } from "./configs/config";
import userRouter from "./routes/user";
import groupRouter from "./routes/group";
import groupUserRequestRouter from "./routes/group-user-request";
import groupUserRouter from "./routes/group-user";
import taskInfoRouter from "./routes/task-info";
import taskAffilationRouter from "./routes/task-affilation";
import subTaskRouter from "./routes/sub-task";
import dahboardRouter from "./routes/dashboard";
import skillRouter from "./routes/skill";
import groupSkillRouter from "./routes/group-skill";
import scheduleRuleRouter from "./routes/schedule-rule";
import shiftRouter from "./routes/shift";
import dayRestrictionRouter from "./routes/day-restriction";
import employmentTypeRouter from "./routes/employment-type";
import preferenceRouter from "./routes/preference";
import unavailableDayRouter from "./routes/unavailable-day";
import workScheduleRouter from "./routes/work-schedule";
import scheduleInformationRouter from "./routes/schedule-information";
import createTables from "./configs/create-tables";

const app = express();
const PORT = appConfig.port;

app.use(cors());
app.use(express.json());
app.use("/stewardship", [
  userRouter,
  groupRouter,
  groupUserRequestRouter,
  groupUserRouter,
  taskInfoRouter,
  taskAffilationRouter,
  subTaskRouter,
  dahboardRouter,
  skillRouter,
  groupSkillRouter,
  scheduleRuleRouter,
  shiftRouter,
  dayRestrictionRouter,
  employmentTypeRouter,
  preferenceRouter,
  unavailableDayRouter,
  workScheduleRouter,
  scheduleInformationRouter,
]);

//createTables();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
