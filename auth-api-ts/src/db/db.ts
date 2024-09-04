import { Pool } from 'pg';

// Configurações da conexão
const pool = new Pool({
  user: 'postgres',
  host: '172.17.0.3',
  database: 'auth_db',
  password: 'test',
  port: 5432, // Porta padrão do PostgreSQL
});

// Função para consultar o banco de dados
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

export default pool;



