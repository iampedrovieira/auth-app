
import { Request, Response } from 'express';
import { isAuthorized } from '../utils/authorization';

export function authorize(action:string) {
	return (req:Request, res:Response, next:Function) => {
		
		const token = req.headers.authorization?.split(' ')[1];

		//Token will be a jwt token (token already be validated on auth middleware)
			//read token and
		const userPermissions = ['Document1-delete-edit_project', 'Document3-delete'];
		console.log(userPermissions);
		//object will be on parms/query
		const object = 'Document3';
		
		if (isAuthorized(userPermissions, action, object)) {
			next();
		} else {
			return res.status(403).json({ message: 'Access denied' });
		}
	};
}