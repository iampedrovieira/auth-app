import { Pool, PoolClient } from 'pg';


const pool = new Pool({
  user: 'postgres',
  host: '172.17.0.3',
  database: 'auth_db',
  password: 'test',
  port: 5432, 
});


export const dbQuery = async (text: string, client: PoolClient,params?: any[]) => {
  
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

export async function dbBeginTransaction() {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
}

export async function dbCommitTransaction(client: PoolClient) {
  await client.query('COMMIT');
  client.release();
}

export async function dbRollbackTransaction(client: PoolClient) {
  await client.query('ROLLBACK');
  client.release();
}