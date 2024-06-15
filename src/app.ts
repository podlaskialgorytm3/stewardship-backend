import express from 'express';
import cors from 'cors';
import { appConfig } from './configs/config';
import userRouter from './routes/user';
import groupRouter from './routes/group';
import groupUserRequestRouter from './routes/group-user-request';
import groupUserRouter from './routes/group-user';
import taskRouter from './routes/task';
import  createTables  from './configs/create-tables';

const app = express();
const PORT = appConfig.port;

app.use(cors());
app.use(express.json());
app.use('/stewardship', [userRouter, groupRouter, groupUserRequestRouter, groupUserRouter,taskRouter]);

createTables()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});