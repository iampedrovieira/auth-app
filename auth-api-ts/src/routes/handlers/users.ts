import { Request, Response } from 'express';
import { query } from '../../db/db';
import { isAuthorized} from '../../utils/authorization';
import { convertPermissionsToJson } from '../../utils/permissions';


export async function getUsers(req: Request, res: Response) {
  const testequery = await query('SELECT * from users');
  res.json({ teste: testequery.rows});
}   

// This will receive a user email and return all info(permeissions, etc)
export async function getUserInfo(req: Request, res: Response) {
  const { token } = req.params;

  const queryT =  `
  SELECT
      u.name AS user_name,
      u.email AS user_email,
      ARRAY_AGG(
          DISTINCT
          'Object: ' || o.name || '; Permissions: ' || p.name
      ) AS permissions,
      ARRAY_AGG(
          DISTINCT
          'Provider: ' || ap.name || ', Provider User ID: ' || uap.provider_user_id || ', Token: ' || uap.token || ', Expires At: ' || uap.expires_at
      ) AS providers
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
      u.token = '${token}'
  GROUP BY
      u.id, u.name, u.email;`;
  
  const testequery = await query(queryT);
  //Convert queryT resutl to JSON
  const userInfo = testequery.rows[0];
  //Format permissions like object-flag-flag-flag

  const result = {
    user_name: userInfo.user_name,
    user_email: userInfo.user_email,
    permissions: convertPermissionsToJson(userInfo.permissions),
    providers: userInfo.providers
  };
  
  res.json(result);
}
