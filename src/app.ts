import express, { Request, Response } from 'express';
import { appConfig } from './configs/config';
import UserController from './controllers/user';
import GroupController from './controllers/group';

const app = express();
const PORT = appConfig.port;

const userController = new UserController();
const groupController = new GroupController();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});