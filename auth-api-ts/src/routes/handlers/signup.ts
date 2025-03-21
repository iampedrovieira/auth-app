import { Request, Response } from 'express';
import { dbBeginTransaction, dbCommitTransaction, dbQuery, dbRollbackTransaction } from '../../db/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { UserRepository } from '../../services/userService';

export async function signup(req: Request, res: Response) {
  const { username, password, email, name } = req.body;
  const client = await dbBeginTransaction();

  if (!username || !password || !email || !name) {
    return res.status(400).json({ error: 'Bad Request' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
	
    await UserRepository.createUser(username,email,name,hashedPassword,client);

    const tokenPayload = {  
      name: name,
      email: email,
      username: username  
    };
		
    const token = jwt.sign(tokenPayload, 'SECRET_KEY', { expiresIn: '1h' });
    
    const resultUpdate = await UserRepository.updateUserToken(username,token,client);
  
    
    if (resultUpdate.rowCount === 0) {
      await dbRollbackTransaction(client);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      await dbCommitTransaction(client);
      const jsonResponse = {
        msg: 'User created',
        token: token
      };
      res.cookie('token', token, {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'strict',  
      });
      return res.status(201).json(jsonResponse);
    }

  } catch (error) { 
    await dbRollbackTransaction(client);
    if (error instanceof Error) {
      if (error.message.includes('duplicate key value violates unique constraint "users_username_key"')) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      if (error.message.includes('duplicate key value violates unique constraint "users_email_key"')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export async function getSignup(req: Request, res: Response) {

  return res.render('signup', { error: null,username: null });
}