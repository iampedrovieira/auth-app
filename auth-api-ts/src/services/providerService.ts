
import { GithubEmailResponse, GithubTokenResponse, GithubUser, GitHubUserResponse } from "../types/user";
import { githubConfig } from "../constants";
import axios from 'axios';

//temp
interface AxiosResponse<T> {
  data: T;
}
export class ProviderRepository {
	
  static async getProviderToken(code:string) :Promise<string>{
    try {

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
    
      return githubTokenResponse.data.access_token;
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

static async getPrimaryEmail(githubToken:string) :Promise<string>{
  try {
    const githubEmailsResponse:AxiosResponse<GithubEmailResponse> = await axios.get(githubConfig.getUserEmails, {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    });
    const primaryEmailObj = githubEmailsResponse.data.find((email: { primary: boolean }) => email.primary);
    return primaryEmailObj!.email;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

static async getUserInfo(githubToken:string) :Promise<GitHubUserResponse>{
  try {
    const githubUserResponse:AxiosResponse<GitHubUserResponse> = await axios.get(githubConfig.getUserInfo, {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    });
    return githubUserResponse.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

}