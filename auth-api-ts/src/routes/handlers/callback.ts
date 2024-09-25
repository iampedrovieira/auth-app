import { Request, Response } from "express";
import axios from 'axios';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from "../../db/db";
import { UserRepository } from "../../services/userService";
import { UserAuthProviderRepository } from "../../services/userAuthProviderService";
import { login } from "../../utils/login";
import { PoolClient } from "pg";
//import { AxiosResponse } from "axios";

//temp
interface AxiosResponse<T> {
  data: T;
}

interface ProviderInfo{
  name:string;
  token:string;
}


interface UserInfo {
  name: string;
  email: string;
  username: string;
  password_hash: string;
}

export const githubCallback = async (req: Request, res: Response) => {
  //Get Username and email from github
  //Save in database
  //Create a token
  //Redirect to status
  interface GithubTokenResponse {
    access_token: string;
  }
  interface GithubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string;
  }


  interface GithubUser {
    name: string;
    login: string;
  }

  interface GithubEmailResponse extends Array<GithubEmail> {}
  
  const { code } = req.query;
  const githubTokenResponse:AxiosResponse<GithubTokenResponse> = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
      code,
    },
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  const githubToken = githubTokenResponse.data.access_token;

  const githubEmailsResponse:AxiosResponse<GithubEmailResponse> = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });

  const githubUserResponse:AxiosResponse<GithubUser> = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });

  const primaryEmailObj = githubEmailsResponse.data.find((email: { primary: boolean }) => email.primary);
  
  const primaryEmail = primaryEmailObj!.email;
  const client = await dbBeginTransaction();
  
  try {
		
		let userObj = await UserRepository.getUserByEmail(primaryEmail,client);
    if (userObj.rowCount === 0) {
      const username = githubUserResponse.data.login;
      //TMEP
      const query = `INSERT INTO USERS (username, password_hash, email, name) 
      VALUES ('${username}', 'FROMPROVIDER', '${primaryEmail}', '${githubUserResponse.data.name}')`;
    
        const resutl = await dbQuery(query,client);
     

        userObj = await UserRepository.getUserByEmail(primaryEmail,client);

        await UserAuthProviderRepository.createUserAuthProvider(primaryEmail, githubToken, 'github',client);
  
    
    }
    const user :UserInfo = userObj.rows[0];
    const provider:ProviderInfo = {
      name: 'github',
      token: githubToken,
    };

    const token = await login(user,client,provider);

      //Create cookie
      res.cookie('token', token, {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'strict',
      });
      
      res.redirect('http://localhost:3000/api/status');
      dbCommitTransaction(client);
    return
	} catch (error) {
		dbCommitTransaction(client);
    return res.status(500).render('login', { username:null, msg: 'Something went wrong with provider login'})
	}
};

function createUserAuthProvider(primaryEmail: string, githubToken: string, arg2: string, client: PoolClient) {
  throw new Error("Function not implemented.");
}
