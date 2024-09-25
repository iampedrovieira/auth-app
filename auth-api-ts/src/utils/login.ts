import { create } from "axios";
import jwt from "jsonwebtoken";
import { UserRepository } from "../services/userService";
import { PoolClient } from "pg";
import { UserAuthProviderRepository } from "../services/userAuthProviderService";
import { updateProviderToken } from "./providers";

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
// This function will be user to login a user by provider and normal auth
export async function login(user:UserInfo,client:PoolClient,provider?:ProviderInfo):Promise<string>
{
  
  if(provider){ 
 
   const resultUpdateProvider = await updateProviderToken(provider,user,client);

   if(!resultUpdateProvider){
     throw new Error("Error while updating provider token");
   }
  };
  //Login logic will have the update on User with token
  const token = createToken(user);
  
  const resultUpdate = await UserRepository.updateUserToken(user.username, token,client);
  if(resultUpdate.rowCount === 0){
    throw new Error("Error while updating token");
  }
  return token
}

function createToken(user:UserTokenPayload):string{
  const tokePayload = {  
    name: user.name,
    email: user.email,
    username: user.username  
  };
  return jwt.sign(tokePayload, 'SECRET_KEY', { expiresIn: '1h' });
}