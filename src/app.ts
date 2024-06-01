import express, { Request, Response } from 'express';

const app = express();
const PORT = 3002;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
