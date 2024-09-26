import { Request, Response } from "express";
import axios from 'axios';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from "../../db/db";
import { UserRepository } from "../../services/userService";
import { UserAuthProviderRepository } from "../../services/userAuthProviderService";
import { login } from "../../utils/login";
import { GithubEmailResponse, GithubTokenResponse, GithubUser, ProviderInfo, UserInfo } from "../../types/user";
import { cookieConfig, githubConfig } from "../../constants";


//temp
interface AxiosResponse<T> {
  data: T;
}

export const githubCallback = async (req: Request, res: Response) : Promise<void>=> {

  const { code } = req.query;

  const githubTokenResponse:AxiosResponse<GithubTokenResponse> = await axios.post(githubConfig.getAccessToken,
    {
      client_id: githubConfig.client_id,
      client_secret: githubConfig.client_secret,
      code,
    },
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  const githubToken :string = githubTokenResponse.data.access_token;
  const githubEmailsResponse:AxiosResponse<GithubEmailResponse> = await axios.get(githubConfig.getUserEmails, {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });
  const githubUserResponse:AxiosResponse<GithubUser> = await axios.get(githubConfig.getUserUser, {
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
    
      await UserRepository.createUser(username, primaryEmail, githubUserResponse.data.name, githubConfig.default_password,client);
      userObj = await UserRepository.getUserByEmail(primaryEmail,client);
      await UserAuthProviderRepository.createUserAuthProvider(primaryEmail, githubToken, githubConfig.provider_name,client);
    
    }
    const user :UserInfo = userObj.rows[0];
    const provider:ProviderInfo = {
      name: githubConfig.provider_name,
      token: githubToken,
    };

    const token:string = await login(user,client,provider);

    res.cookie('token', token, {
      httpOnly: cookieConfig.httpOnly, 
      maxAge:cookieConfig.maxAge, 
      sameSite: 'strict',
    });
      
    res.redirect('http://localhost:3000/api/status');
    dbCommitTransaction(client);
    return
	} catch (error) {
		dbCommitTransaction(client);
    res.status(500).render('login', { username:null, msg: 'Something went wrong with provider login'});
    return
	}
};