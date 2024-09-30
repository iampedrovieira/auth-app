import { Pool, QueryResult } from 'pg';
import { UserAuthProviderRepository } from '../../services/userAuthProviderService';

describe('UserAuthProviderRepository', () => {

  let pool: any;
  let client: any;

  beforeEach(() => {
    pool = new Pool();
    client = pool.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserAuthProvider', () => {
    it('should create a user auth provider and return the result', async () => {
      const mockEmail = 'test@example.com';
      const mockToken = 'mockToken';
      const mockProvider = 'github';
      const mockResult: QueryResult = {
        rows: [],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: [],
      };

      client.query.mockResolvedValueOnce(mockResult);
      const createdUser = await UserAuthProviderRepository.createUserAuthProvider(mockEmail, mockToken, mockProvider, client);


      expect(createdUser.rowCount).toEqual(1);
    });
  });

  
});