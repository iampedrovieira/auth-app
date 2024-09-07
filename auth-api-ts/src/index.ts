import express from 'express';
import router from './routes/routes';
import { authentication } from './middleware/authentication';
const app = express();

app.use(express.json());

app.use('/api',authentication(),router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});