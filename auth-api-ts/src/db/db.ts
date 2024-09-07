import { Pool, PoolClient } from 'pg';


const pool = new Pool({
  user: 'postgres',
  host: '172.17.0.3',
  database: 'auth_db',
  password: 'test',
  port: 5432, 
});

let client: PoolClient;

export const dbQuery = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

export async function dbBeginTransaction() {
  client = await pool.connect();
  await client.query('BEGIN');
}

export async function dbCommitTransaction() {
  await client.query('COMMIT');
  client.release();
}

export async function dbRollbackTransaction() {
  await client.query('ROLLBACK');
  client.release();
}