
import { Request, Response } from 'express';
import { isAuthorized } from '../utils/authorization';
import { dbQuery } from '../db/db';
import { convertPermissionsToJson } from '../utils/permissions';

export function authorize(action:string) {
	return async (req:Request, res:Response, next:Function) => {
		const {object} = req.params;
		const username = req.user.username;

		const query = `
      SELECT
        ARRAY_AGG(
            DISTINCT
            'Object: ' || o.name || '; Permissions: ' || p.name
        ) AS permissions
      FROM
          users u
      LEFT JOIN
          user_permissions up ON u.id = up.user_id
      LEFT JOIN
          objects o ON up.object_id = o.id
      LEFT JOIN
          permissions p ON up.permission_id = p.id
      LEFT JOIN
          user_auth_providers uap ON u.id = uap.user_id
      LEFT JOIN
          auth_providers ap ON uap.provider_id = ap.id
      WHERE
                u.username = '${username}'
          and  o.name = '${object}'`;
    try {
      const result = await dbQuery(query);
      if (result.rows[0].permissions == null) {

        //In the future will have a flag that to put objcet visible or not for everyone
        return res.status(404).json({ message: 'Object not found or not permissions to read the object' });
      }
  
      const userPermissions = convertPermissionsToJson(result.rows[0].permissions)
      
      if (isAuthorized(userPermissions, action, object)) {
        next();
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {

      return res.status(500).json({ error: 'Internal Server Error' });
    } 

	};
}