import express from 'express';
import router from './routes/routes';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use('/api',router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});