import jwt, { SignOptions } from "jsonwebtoken";
import { UserRepository } from "../services/userService";
import { PoolClient } from "pg";
import { updateProviderToken } from "./providers";
import { ProviderInfo, UserInfo, UserTokenPayload } from "../types/user";
import { jwtConfig } from "../constants";

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

function createToken(user:UserTokenPayload): string{
  const tokePayload = {  
    name: user.name,
    email: user.email,
    username: user.username  
  };
  return jwt.sign(tokePayload, jwtConfig.secret as string, { expiresIn: jwtConfig.expiresIn } as SignOptions);
}