import { Request, Response } from "express";
import axios from 'axios';
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from "../../db/db";
import { UserRepository } from "../../services/userService";
import { UserAuthProviderRepository } from "../../services/userAuthProviderService";
import { login } from "../../utils/login";
import { GithubEmailResponse, GithubTokenResponse, GithubUser, GitHubUserResponse, ProviderInfo, UserInfo } from "../../types/user";
import { cookieConfig, githubConfig } from "../../constants";
import { ProviderRepository } from "../../services/providerService";

export const githubCallback = async (req: Request, res: Response) : Promise<void>=> {

  const { code } = req.query;

  const githubToken :string = await ProviderRepository.getProviderToken(code as string);
  const githubUserInfo:GitHubUserResponse = await ProviderRepository.getUserInfo(githubToken);
  const primaryEmail = await ProviderRepository.getPrimaryEmail(githubToken);
  const client = await dbBeginTransaction();
  
  try {
		
		let userObj = await UserRepository.getUserByEmail(primaryEmail,client);
    if (userObj.rowCount === 0) {
      const username = githubUserInfo.login;
    
      await UserRepository.createUser(username, primaryEmail, githubUserInfo.name, githubConfig.default_password,client);
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
    
    res.redirect(process.env.BASE_APP_URL+'/api/status');
    dbCommitTransaction(client);
    return
	} catch (error) {
		dbCommitTransaction(client);
    res.status(500).render('login', { username:null, msg: 'Something went wrong with provider login'});
    return
	}
};