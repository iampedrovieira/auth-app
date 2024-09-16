import { Request, Response } from 'express';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from '../../db/db';

export async function getObject(req: Request, res: Response) {

  const {object} = req.params;
  const client = await dbBeginTransaction();

  const query = `
    SELECT o.name, o.description, array_agg(DISTINCT u.username) as usernames
    FROM objects o
    JOIN user_permissions p ON o.id = p.object_id
    JOIN users u ON p.user_id = u.id
    where o.name = '${object}'
    GROUP BY o.name, o.description
  `;

  try {
    const result = await dbQuery(query,client);
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
  const client = await dbBeginTransaction();

  const query = `
   DELETE FROM objects WHERE name = '${object}';
  `;

  try {
    const result = await dbQuery(query,client);
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
  const client = await dbBeginTransaction();

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
      const permissionResult = await dbQuery(checkPermissionQuery,client);
      if (permissionResult.rowCount === 0) {
       
        permissionsDetails.push({[permission]: 'Permission not exists'});
        continue;
      }

      // Check if the user already has the permission for the object
      const checkUserPermissionQuery = `
        SELECT * FROM user_permissions WHERE user_id = (SELECT id FROM users WHERE username = '${username}') AND object_id = (SELECT id FROM objects WHERE name = '${object}') AND permission_id = ${permissionResult.rows[0].id}
      `;

      const userPermissionResult = await dbQuery(checkUserPermissionQuery,client);

      if (userPermissionResult.rowCount === 0) {
        const insertUserPermissionQuery = `
          INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES 
          ((SELECT id FROM users WHERE username = '${username}'), (SELECT id FROM objects WHERE name = '${object}'), ${permissionResult.rows[0].id})
        `;
        await dbQuery(insertUserPermissionQuery,client);
        dbCommitTransaction(client);
        permissionsDetails.push({[permission]: 'Permission added'});
      }else{
        permissionsDetails.push({[permission]: 'User already has this permission'});
        continue;
      }

      }catch (error) {
        dbCommitTransaction(client);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  }

  return res.status(200).json({ permissionsDetails: permissionsDetails });
}

export async function removeUserFromObject(req: Request, res: Response) {
  const { object } = req.params;
  const { username, permissions } = req.body;

  if (!username || !permissions) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const permissionsDetails: {[key:string]:string} []= [];
  const client = await dbBeginTransaction();
  for (const permission of permissions) {
    // Check if the permission exists in the permissions table

    if (permission === 'remove-all') {

      const removeAllUserPermissionsQuery = `
        DELETE FROM user_permissions WHERE user_id = (SELECT id FROM users WHERE username = '${username}') AND object_id = (SELECT id FROM objects WHERE name = '${object}')
      `;
    
      await dbQuery(removeAllUserPermissionsQuery,client);
      dbCommitTransaction(client);
      permissionsDetails.push({[permission]: 'All user permissions removed'});
      break;
    }
    const checkPermissionQuery = `
      SELECT id FROM permissions WHERE name = '${permission}'
    `;

    try {
      const permissionResult = await dbQuery(checkPermissionQuery,client);
      if (permissionResult.rowCount === 0) {
        // Remove the user's permission for the object
        const removeUserPermissionQuery = `
        DELETE FROM user_permissions WHERE user_id = (SELECT id FROM users WHERE username = '${username}') AND object_id = (SELECT id FROM objects WHERE name = '${object}') AND permission_id = ${permissionResult.rows[0].id}
      `;

        await dbQuery(removeUserPermissionQuery,client);
        dbCommitTransaction(client);
        permissionsDetails.push({[permission]: 'Permission not exists'});
        continue;
      }

      // Check if the user has the permission for the object
      const checkUserPermissionQuery = `
        SELECT * FROM user_permissions WHERE user_id = (SELECT id FROM users WHERE username = '${username}') AND object_id = (SELECT id FROM objects WHERE name = '${object}') AND permission_id = ${permissionResult.rows[0].id}
      `;

      const userPermissionResult = await dbQuery(checkUserPermissionQuery,client);

      if (userPermissionResult.rowCount === 0) {
        permissionsDetails.push({[permission]: 'User does not have this permission'});
        continue;
      }

      // Remove the user's permission for the object
      const removeUserPermissionQuery = `
        DELETE FROM user_permissions WHERE user_id = (SELECT id FROM users WHERE username = '${username}') AND object_id = (SELECT id FROM objects WHERE name = '${object}') AND permission_id = ${permissionResult.rows[0].id}
      `;

  
      await dbQuery(removeUserPermissionQuery,client);
      dbCommitTransaction(client);
      permissionsDetails.push({[permission]: 'Permission removed'});

    } catch (error) {
      dbCommitTransaction(client);
      return res.status(500).json({ error: 'Internal Server Error' });
      
    }
  }

  return res.status(200).json({ permissionsDetails: permissionsDetails });
}

export async function updateObject(req: Request, res: Response) {
  const { object } = req.params;
  const { description } = req.body;
  const client = await dbBeginTransaction();
  if (!description) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const updateQuery = `
    UPDATE objects SET description = '${description}' WHERE name = '${object}'
  `;
  try {
    const result = await dbQuery(updateQuery,client);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Object not found" });
      return;
    }
    return res.status(200).json({ message: 'Object updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createObject(req: Request, res: Response) {
  const { description } = req.body;
  const client = await dbBeginTransaction();
  if (!description) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const currentDate = new Date();
  const name = `object_${currentDate.getTime()}`;

  const checkObjectQuery = `
    SELECT * FROM objects WHERE name = '${name}'
  `;

  try {
    const objectResult = await dbQuery(checkObjectQuery,client);
    console.log(objectResult);
    if (objectResult.rowCount === 0) {
      const insertObjectQuery = `
      INSERT INTO objects (name, description) VALUES ('${name}', '${description}')
    `;
      const result = await dbQuery(insertObjectQuery,client);
      
        res.status(201).json({ message: 'Object created',
        objectDetails: {name: name, description: description}
      });
    }else{
      res.status(409).json({ error: 'Object already exists' });
    }
    dbCommitTransaction(client);
  } catch (error) {
    dbCommitTransaction(client);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}