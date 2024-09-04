import express from 'express';
import usersRouter from './routes/users';

const app = express();


app.use('/api/users', usersRouter);

const PORT = 3000;


app.get('/', (req, res) => {

    res.send('Hello World!');
    
    });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});