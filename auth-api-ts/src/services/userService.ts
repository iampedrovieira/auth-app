import { dbQuery } from "../db/db";


export class UserRepository {
	
	static async getUserByUsername(username: string) {
	try {
		const result = await dbQuery(`SELECT name, email, username, password_hash FROM USERS WHERE username = '${username}'`);
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
	}

	static async updateUserToken(username: string, token: string) {
		try {
			const result = await dbQuery(`UPDATE USERS SET TOKEN = '${token}' WHERE username = '${username}'`);
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
		}

}