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

  static async getUserByEmail(email: string, client: PoolClient):Promise<QueryResult> {
    try {
      const result = await dbQuery(`SELECT name, email, username, password_hash FROM USERS WHERE email = '${email}'`, client);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

	static async updateUserToken(username: string, token: string,client:PoolClient):Promise<QueryResult> {
		try {
      
			const result = await dbQuery(`UPDATE USERS SET TOKEN = '${token}' WHERE username = '${username}'`,client);
   
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
		}
  
  static async createUser(username:string,email:string,name:string,password:string,client:PoolClient) :Promise<QueryResult>{
    try {
      const result = await dbQuery(`INSERT INTO USERS (username, password_hash, email, name) VALUES ('${username}', '${password}', '${email}', '${name}')`, client);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}