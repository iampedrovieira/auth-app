
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export function authentication() {
	return (req:Request, res:Response, next:Function) => {
		const token = req.headers.authorization?.split(' ')[1];
   
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
      if (err) {
        //When implemented, redirect to login page
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });

	};
}