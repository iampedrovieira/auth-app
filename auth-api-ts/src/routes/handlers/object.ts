import { Request, Response } from 'express';
import { dbQuery } from '../../db/db';

export async function getObject(req: Request, res: Response) {

  const {object} = req.params;

  const queryT = `
    SELECT o.name, o.description, array_agg(DISTINCT u.username) as usernames
    FROM objects o
    JOIN user_permissions p ON o.id = p.object_id
    JOIN users u ON p.user_id = u.id
    where o.name = '${object}'
    GROUP BY o.name, o.description
  `;

  try {
    const result = await dbQuery(queryT);
    if (result.rows.length === 0) {
      res.status(404).json({message: "Object not found"});
      return;
    }
    return res.json(result.rows[0]);
  }
  catch (error) {
    return res.status(500).json({ error: 'Internal Server Error'});
  }

}   