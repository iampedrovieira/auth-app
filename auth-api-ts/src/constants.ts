import dotenv from 'dotenv';
dotenv.config();

export const githubConfig = {
    provider_name: 'github',
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    default_password: 'fromProvider',
    getAccessToken: 'https://github.com/login/oauth/access_token',
    getUserUser: 'https://api.github.com/user',
    getUserEmails: 'https://api.github.com/user/emails',
};

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
};

export const cookieConfig = {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    httpOnly: true,
};