
import { Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export function authentication() {
	return (req:Request, res:Response, next:Function) => {
		const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    const contentType = req.headers['content-type'];

    if (!token) {

      if (contentType && contentType.includes('application/json')) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        return res.render('login', { msg: null,username: null})
      }
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      
      if (contentType && contentType.includes('application/json')) {
        return res.status(500).json({ message: 'Internal Server Error' });
      } else {
        return res.render('login', { msg: 'Internal Server Error',username: null})
      }
    }
    jwt.verify(token, jwtSecret,  (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        
        if (contentType && contentType.includes('application/json')) {
          return res.status(401).json({ message: 'Unauthorized' });
        } else {
          return res.render('login', { msg: 'Unauthorized',username: null})
        }

      }
      req.user = decoded;
      next();
    });

	};
}