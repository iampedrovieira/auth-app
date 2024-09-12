import { Request, Response } from 'express';
import { dbQuery } from '../../db/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';    

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const contentType = req.headers['content-type'];

  if (!username || !password) {
      return res.status(400).json({ error: 'Bad Request' });
  }
  const query =  
  `SELECT name, email, username, password_hash FROM USERS WHERE username = '${username}' `;
  const result = await dbQuery(query);

  if (result.rowCount === 0) {
    if (contentType && contentType.includes('application/json')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    } else {
      return res.render('login', { error: 'Invalid credentials',username: username})
    }
  }else{
    const isPasswordValid = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!isPasswordValid) {
      if (contentType && contentType.includes('application/json')) {
        return res.status(401).json({ error: 'Invalid credentials' });
      } else {
        return res.render('login', { error: 'Invalid credentials',username: username})
      }
    }
    const tokePayload = {  
      name: result.rows[0].name,
      email: result.rows[0].email,
      username: result.rows[0].username  
    };
      const token = jwt.sign(tokePayload, 'SECRET_KEY', { expiresIn: '1h' });
      const queryUpdate = 
      ` UPDATE USERS SET TOKEN = '${token}' WHERE username = '${username}'`;
      const resultUpdate = await dbQuery(queryUpdate);
      if (resultUpdate.rowCount === 0) {
        if (contentType && contentType.includes('application/json')) {
          return res.status(401).json({ error: 'Internal Server Error' });
        } else {
          return res.render('login', { error: 'Internal Server Error',username: username})
        }
      }else{
        const jsonResponse = {
          msg:'OK',
          token: token
        };

        res.cookie('token', token, {
          httpOnly: true, 
          maxAge: 24 * 60 * 60 * 1000, 
          sameSite: 'strict',
        });
        return res.status(200).json(jsonResponse);
      }
  }
};

export async function getLogin(req: Request, res: Response) {

  return res.render('login', { error: null,username: null });
}