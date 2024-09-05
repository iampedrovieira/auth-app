
import { Request, Response } from 'express';

export function authentication() {
	return (req:Request, res:Response, next:Function) => {
		
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}      

    //Check token validity if is not, redirect to login (implement when have jwt and login)
    const checkToken = true;
    if(checkToken) {
      next();
    }else {
      res.status(401).json({ message: 'Unauthorized' });
    }     
  

	};
}