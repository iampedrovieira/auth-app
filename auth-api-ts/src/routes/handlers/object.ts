import { Request, Response } from 'express';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from '../../db/db';

export async function getObject(req: Request, res: Response) {

  const {object} = req.params;

  const query = `
    SELECT o.name, o.description, array_agg(DISTINCT u.username) as usernames
    FROM objects o
    JOIN user_permissions p ON o.id = p.object_id
    JOIN users u ON p.user_id = u.id
    where o.name = '${object}'
    GROUP BY o.name, o.description
  `;

  try {
    const result = await dbQuery(query);
    if (result.rowCount === 0) {
      res.status(404).json({message: "Object not found"});
      return;
    }
    return res.json(result.rows[0]);
  }
  catch (error) {
    return res.status(500).json({ error: 'Internal Server Error'});
  }

}   

export async function deleteObject(req: Request, res: Response) {

  const {object} = req.params;

  const query = `
   DELETE FROM objects WHERE name = '${object}';
  `;

  try {
    const result = await dbQuery(query);
    console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({message: "Object not found"});
      return;
    }
    return res.status(200).json({ message: 'Object deleted' });
  }
  catch (error) {
    return res.status(500).json({ error: 'Internal Server Error'});
  }

} 

export async function addUserToObject(req: Request, res: Response) {
  const { object } = req.params;
  const { username, permissions } = req.body;

  if (!username || !permissions) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const permissionsDetails: {[key:string]:string} []= [];
  
  for (const permission of permissions) {
    // Check if the permission exists in the permissions table
    const checkPermissionQuery = `
      SELECT id FROM permissions WHERE name = '${permission}'
    `;

    try {
      const permissionResult = await dbQuery(checkPermissionQuery);
      if (permissionResult.rowCount === 0) {
       
        permissionsDetails.push({[permission]: 'Permission not exists'});
        continue;
      }

      // Check if the user already has the permission for the object
      const checkUserPermissionQuery = `
        SELECT * FROM user_permissions WHERE user_id = (SELECT id FROM users WHERE username = '${username}') AND object_id = (SELECT id FROM objects WHERE name = '${object}') AND permission_id = ${permissionResult.rows[0].id}
      `;

      const userPermissionResult = await dbQuery(checkUserPermissionQuery);

      if (userPermissionResult.rowCount === 0) {
        const insertUserPermissionQuery = `
          INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES 
          ((SELECT id FROM users WHERE username = '${username}'), (SELECT id FROM objects WHERE name = '${object}'), ${permissionResult.rows[0].id})
        `;
        dbBeginTransaction();
        await dbQuery(insertUserPermissionQuery);
        dbCommitTransaction();
        permissionsDetails.push({[permission]: 'Permission added'});
      }else{
        permissionsDetails.push({[permission]: 'User already has this permission'});
        continue;
      }

      }catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  }

  return res.status(200).json({ permissionsDetails: permissionsDetails });
}
