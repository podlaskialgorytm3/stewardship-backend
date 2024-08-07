import express from 'express';
import cors from 'cors';
import { appConfig } from './configs/config';
import userRouter from './routes/user';
import groupRouter from './routes/group';
import groupUserRequestRouter from './routes/group-user-request';
import groupUserRouter from './routes/group-user';
import taskInfoRouter from './routes/task-info';
import taskAffilationRouter from './routes/task-affilation';
import subTaskRouter from './routes/sub-task';
import workingHoursRouter from './routes/working-hours';
import  createTables  from './configs/create-tables';

const app = express();
const PORT = appConfig.port;

app.use(cors());
app.use(express.json());
app.use('/stewardship', [userRouter, groupRouter, groupUserRequestRouter, groupUserRouter,taskInfoRouter, taskAffilationRouter,subTaskRouter, workingHoursRouter]);

//createTables()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});