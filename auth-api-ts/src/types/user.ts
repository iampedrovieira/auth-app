export interface UserInfo {
  name: string;
  email: string;
  username: string;
  password_hash: string;
}

export interface ProviderInfo{
  name:string;
  token:string;
}

export interface GithubTokenResponse {
  access_token: string;
}


export interface GithubTokenResponse {
  access_token: string;
}
export interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}


export interface GithubUser {
  name: string;
  login: string;
}

export interface GithubEmailResponse extends Array<GithubEmail> {}

export interface UserTokenPayload{
  name:string;
  email:string;
  username:string;
}