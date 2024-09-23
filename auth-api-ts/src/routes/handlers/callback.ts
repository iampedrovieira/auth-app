import { Request, Response } from "express";
import axios from 'axios';

export const githubCallback = async (req: Request, res: Response) => {
  //Get Username and email from github
  //Save in database
  //Create a token
  //Redirect to status
  const { code } = req.query;
  const githubTokenResponse = await axios.post(
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

  interface GithubTokenResponse {
    access_token: string;
  }

  interface GithubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
  }

  const githubToken = (githubTokenResponse.data as GithubTokenResponse).access_token;

  const githubEmailsResponse = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });

  const primaryEmailObj = (githubEmailsResponse.data as Array<GithubEmail>).find((email: { primary: boolean }) => email.primary);
  console.log(primaryEmailObj?.email);

  // Save username and email in the database
  // Create a token
  return res.redirect('http://localhost:3000/api/status');
};