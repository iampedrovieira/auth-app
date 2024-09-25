import { PoolClient } from "pg";
import { UserAuthProviderRepository } from "../services/userAuthProviderService";

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
  
  interface UserTokenPayload{
    name:string;
    email:string;
    username:string;
  }


export async function updateProviderToken(provider:ProviderInfo, user:UserTokenPayload,client:PoolClient,):Promise<boolean>{
  
    const result = await UserAuthProviderRepository.updateUserAuthProvider(user.email, provider.token, provider.name,client);
    if(result.rowCount === 0){
      return false;
    }
    return true;
  }
