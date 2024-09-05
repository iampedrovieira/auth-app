
import { Request, Response } from 'express';
import { isAuthorized } from '../utils/authorization';

export function authorize(action:string) {
	return (req:Request, res:Response, next:Function) => {
		
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}

		//Token will be a jwt token (token already be validated on auth middleware)
			//read token and
		const userPermissions = ['decoded.permissions'];
		//objetct will be on parms/query
		const object = 'Document1';
		
		if (isAuthorized(userPermissions, action, object)) {
			next();
		} else {
			res.status(403).json({ message: 'Access denied' });
		}
	};
}