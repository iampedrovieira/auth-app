import { Pool, PoolClient } from 'pg';


const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'auth-api-ci-cd',
  password: 'postgres',
  port: 5432, 
});


export const dbQuery = async (text: string, client: PoolClient, params?: any[]) => {
  try {
    const res = await client.query(text, params);
    return res;
  } catch (err) {
    throw err;
  }
};

export async function dbBeginTransaction(): Promise<PoolClient> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    return client;
  } catch (err) {
    client.release();
    throw err;
  }
}

export async function dbCommitTransaction(client: PoolClient): Promise<void> {
  try {
    await client.query('COMMIT');
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function dbRollbackTransaction(client: PoolClient): Promise<void> {
  try {
    await client.query('ROLLBACK');
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}