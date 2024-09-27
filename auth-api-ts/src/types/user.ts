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
  token_type?: string,
  scope?: string,
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

export interface GitHubUserResponse {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
}
