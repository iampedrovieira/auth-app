import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT as string),
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