import express, { Request, Response } from 'express';
import { appConfig } from './configs/config';

const app = express();
const PORT = appConfig.port;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});