import express, { Request, Response } from 'express';
import cors from 'cors';
import { appConfig } from './configs/config';
import router from './routes/user';
import GroupUserController from './controllers/group-user';


const app = express();
const PORT = appConfig.port;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

const groupUserController = new GroupUserController();

app.use(cors());
app.use(express.json());
app.use('/stewardship', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  groupUserController.createTable();
});