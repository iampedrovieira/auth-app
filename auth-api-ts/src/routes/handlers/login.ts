import { Request, Response } from 'express';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from '../../db/db';
import bcrypt from 'bcryptjs';    
import { LoginDto } from '../../dto/Login.dto';
import { ResponseDto } from '../../dto/Response.dto';
import { UserRepository } from '../../services/userService';
import { login } from '../../utils/login';
import { UserInfo } from '../../types/user';
import { cookieConfig } from '../../constants';


export async function loginHandler(req: Request<{},{},LoginDto>, res: Response<ResponseDto>,) {
  
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
    const userObj = await UserRepository.getUserByUsername(username,client);
    if (userObj.rowCount === 0) {

      if (contentType && contentType.includes('application/json')) {
        res.status(401).json({ msg: 'Invalid credentials' });
        
      } else {
     
        res.status(401).render('login', { msg: 'Invalid credentials',username: username})
      }
      dbCommitTransaction(client);
      return;
    }else{
      const user :UserInfo = userObj.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        if (contentType && contentType.includes('application/json')) {
          res.status(401).json({ msg: 'Invalid credentials' });
        } else {
          res.status(401).render('login', { msg: 'Invalid credentials',username: username})
        }
        dbCommitTransaction(client);
        return;
      }
      const token = await login(user,client);
      
      res.cookie('token', token, {
        httpOnly: cookieConfig.httpOnly, 
        maxAge:cookieConfig.maxAge, 
        sameSite: 'strict',
      });

      dbCommitTransaction(client);

      return res.status(200).json({
        msg:'OK',
        token: token,
      });
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

export function getLogin(req: Request<{},{},LoginDto>, res: Response<ResponseDto>) :void{

  res.render('login', { msg: null,username: null });
  return
}

export const githubLogin = (req: Request, res: Response):void=> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.BASE_APP_URL+'/api/auth/callback';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
  res.redirect(githubAuthUrl);
  return
};

export { login };
