import { Pool, PoolClient } from "pg";
import { dbQuery } from "../db/db";

export class UserAuthProviderRepository {

	static async createUserAuthProvider(primaryEmail: string, token:string, provider: string,client:PoolClient) {
		try {
      
			const result = await dbQuery(`INSERT INTO user_auth_providers (user_id, token, provider_id) VALUES ((SELECT id FROM USERS WHERE email = '${primaryEmail}'), '${token}',
         (select id from auth_providers WHERE name = '${provider}'))`, client);

			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
		}

  static async updateUserAuthProvider(primaryEmail: string, token: string, provider: string, client: PoolClient) {
    try {

      const result = await dbQuery(`UPDATE user_auth_providers 
                      SET token = '${token}', provider_id = (SELECT id FROM auth_providers WHERE name = '${provider}')
                      WHERE user_id = (SELECT id FROM USERS WHERE email = '${primaryEmail}')`, client);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
