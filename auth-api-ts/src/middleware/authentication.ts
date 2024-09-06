
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authentication() {
	return (req:Request, res:Response, next:Function) => {
    
		//const token = req.headers.authorization?.split(' ')[1] || '';
    const payload = {"user_name":"Bob Smith","user_email":"bob@example.com","permissions":["Document1-delete-edit_project","Document3-delete"],"providers":["Provider: github, Provider User ID: github_user_id_2, Token: github_token_2, Expires At: 2024-12-31 00:00:00","Provider: google, Provider User ID: google_user_id_2, Token: google_token_2, Expires At: 2024-12-31 00:00:00"]};
    const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        //When implemented, redirect to login page
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      next();
    });

	};
}