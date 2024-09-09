import { Request, Response } from 'express';
import { dbQuery } from '../../db/db';

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