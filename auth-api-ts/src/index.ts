import { createApp } from './createApp';
import dotenv from 'dotenv';

dotenv.config();

const app = createApp();
const PORT = process.env.API_PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
