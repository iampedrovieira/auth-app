import { Pool, PoolClient, QueryResult } from "pg";
import { dbQuery } from "../db/db";

export class UserRepository {
	
	static async getUserByUsername(username: string,client:PoolClient): Promise<QueryResult> {
	try {
		const result = await dbQuery(`SELECT name, email, username, password_hash FROM USERS WHERE username = '${username}'`,client);
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
	}

  static async getUserByEmail(email: string, client: PoolClient) {
    try {
      const result = await dbQuery(`SELECT name, email, username, password_hash FROM USERS WHERE email = '${email}'`, client);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

	static async updateUserToken(username: string, token: string,client:PoolClient) {
		try {
      
			const result = await dbQuery(`UPDATE USERS SET TOKEN = '${token}' WHERE username = '${username}'`,client);
   
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
		}
  
  static async createUserFromProvider(username:string,email:string,name:string,client:PoolClient) {
    try {
      const result = await dbQuery(`INSERT INTO USERS (name, email, username) VALUES ('${name}', '${email}', '${username}')`, client);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}