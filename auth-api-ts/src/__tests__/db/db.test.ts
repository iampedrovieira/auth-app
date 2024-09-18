import { dbQuery, dbBeginTransaction, dbCommitTransaction, dbRollbackTransaction } from '../../db/db';
import { Pool } from 'pg';

describe('Data base Unit tests', () => {
  let pool: any;
  let client: any;

  beforeEach(() => {
    pool = new Pool();
    client = pool.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('test dbQuery function', () => {
    it('should execute a query and return the query result', async () => {
      const mockQuery = 'SELECT * FROM users';
      const mockResult = { rows: [{ id: 1, name: 'John Doe' }] };
      client.query.mockResolvedValueOnce(mockResult);
      const result = await dbQuery(mockQuery,client);
      expect(client.query).toHaveBeenCalledWith(mockQuery, undefined);
      expect(result).toEqual(mockResult);
  
    });
    it('should throw an error if the query fails', async () => {
      const mockQuery = 'SELECT * FROM users';
      const mockError = new Error('Query failed');
      client.query.mockRejectedValueOnce(mockError);

      await expect(dbQuery(mockQuery, client)).rejects.toThrow('Query failed');
      expect(client.query).toHaveBeenCalledWith(mockQuery, undefined);

    });

  });

  describe('test dbBeginTransaction function', () => {
    it('should begin a transaction and return the client', async () => {
      client.query.mockResolvedValueOnce({});
      const result = await dbBeginTransaction();
      expect(pool.connect).toHaveBeenCalled();
      expect(client.query).toHaveBeenCalledWith('BEGIN');
      expect(result).toEqual(client);
    });

    it('should release the client if an error occurs', async () => {
      client.query.mockRejectedValueOnce(new Error('Transaction error'));

      await expect(dbBeginTransaction()).rejects.toThrow('Transaction error');
      expect(client.release).toHaveBeenCalled();
    });
  });

  describe('dbCommitTransaction', () => {
    it('should commit a transaction and release the client', async () => {
      client.query.mockResolvedValueOnce({});

      await dbCommitTransaction(client);

      expect(client.query).toHaveBeenCalledWith('COMMIT');
      expect(client.release).toHaveBeenCalled();
    });
  });

  describe('dbRollbackTransaction', () => {
    it('should rollback a transaction and release the client', async () => {
      client.query.mockResolvedValueOnce({});

      await dbRollbackTransaction(client);

      expect(client.query).toHaveBeenCalledWith('ROLLBACK');
      expect(client.release).toHaveBeenCalled();
    });
  })
});