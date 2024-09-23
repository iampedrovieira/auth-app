import { Request, Response } from 'express';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from '../../db/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';    
import { LoginDto } from '../../dto/Login.dto';
import { ResponseDto } from '../../dto/Response.dto';
import { UserRepository } from '../../services/userService';
import { PoolClient } from 'pg';

export async function login(req: Request<{},{},LoginDto>, res: Response<ResponseDto>,) {
  
  const username = req.body.username;
  const password = req.body.password;
  const contentType = req.headers['content-type'];
  
  if (!username || !password) {
    if (contentType && contentType.includes('application/json')) {
      return res.status(400).json({ msg: 'Bad Request'});
      
    } else {
      return res.status(400).render('login', { msg: 'Bad Request'})
    }
  }
  const client = await dbBeginTransaction();
  try{
     
    const result = await UserRepository.getUserByUsername(username,client);

    if (result.rowCount === 0) {

      if (contentType && contentType.includes('application/json')) {
        res.status(401).json({ msg: 'Invalid credentials' });
        
      } else {
     
        res.status(401).render('login', { msg: 'Invalid credentials',username: username})
      }
      dbCommitTransaction(client);
      return;
    }else{
      const isPasswordValid = await bcrypt.compare(password, result.rows[0].password_hash);

      if (!isPasswordValid) {
        if (contentType && contentType.includes('application/json')) {
          res.status(401).json({ msg: 'Invalid credentials' });
        } else {
          res.status(401).render('login', { msg: 'Invalid credentials',username: username})
        }
        dbCommitTransaction(client);
        return;
      }
      const tokePayload = {  
        name: result.rows[0].name,
        email: result.rows[0].email,
        username: result.rows[0].username  
      };
      const token = jwt.sign(tokePayload, 'SECRET_KEY', { expiresIn: '1h' });
      const resultUpdate = await UserRepository.updateUserToken(username, token,client);
      if (resultUpdate.rowCount === 0) {
        if (contentType && contentType.includes('application/json')) {
          res.status(401).json({ msg: 'Internal Erro' });
        } else {
          res.status(401).render('login', { msg: 'Internal Erro',username: username})
        }
        dbCommitTransaction(client);
        return;
      }else{
      
        res.cookie('token', token, {
          httpOnly: true, 
          maxAge: 24 * 60 * 60 * 1000, 
          sameSite: 'strict',
        });

        dbCommitTransaction(client);
        return res.status(200).json({
          msg:'OK',
          token: token,
        });
      }
  }

  }catch(error){
   
    dbCommitTransaction(client);
    if (contentType && contentType.includes('application/json')) {
      return res.status(500).json({ msg: 'Internal Error' });
      
    } else {
      return res.status(500).render('login', { msg: 'Internal Error'})
    }
 
  }
  
};

export async function getLogin(req: Request<{},{},LoginDto>, res: Response<ResponseDto>) {

  return res.render('login', { msg: null,username: null });
}

export const githubLogin = (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;

  res.redirect(githubAuthUrl);
};