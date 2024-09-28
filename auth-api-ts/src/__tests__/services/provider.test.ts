import { ProviderRepository } from '../../services/providerService';
import axios from 'axios';
import { GithubTokenResponse, GithubEmailResponse, GitHubUserResponse } from '../../types/user';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
//temp
interface AxiosResponse<T> {
    data: T;
  }
describe('ProviderRepository', () => {
  describe('getProviderToken', () => {
    it.only('should return the access token from the GitHub API', async () => {
      // Mock da resposta do GitHub com o tipo correto
      const mockTokenResponse:GithubTokenResponse = {
            access_token: 'mocked-access-token',
            token_type: 'bearer',
            scope: 'repo,gist',
      };

      mockedAxios.post.mockResolvedValue({
        data: mockTokenResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            url: ''
        },
      });

      const token = await ProviderRepository.getProviderToken('mock-code');
      
      // Validação de que o token retornado corresponde ao esperado
      expect(token).toBe('mocked-access-token');
      expect(typeof token).toBe('string');
    });

    it('should throw an error if GitHub API fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API Error'));

      await expect(ProviderRepository.getProviderToken('mock-code')).rejects.toThrow('API Error');
    });
  });

  describe('getPrimaryEmail', () => {
    it('should return the primary email from the GitHub API', async () => {
      const mockEmailResponse: GithubEmailResponse = [
        { email: 'primary@example.com', primary: true, verified: true, visibility: 'public' },
        { email: 'secondary@example.com', primary: false, verified: true, visibility: 'public' },
      ];

      

      const email = await ProviderRepository.getPrimaryEmail('mocked-access-token');

      expect(email).toBe('primary@example.com');
      expect(typeof email).toBe('string');
    });

    it('should throw an error if no primary email is found', async () => {
      const mockEmailResponse: GithubEmailResponse = [
        { email: 'secondary@example.com', primary: false, verified: true, visibility: 'public' },
      ];

      //mockedAxios.get.mockResolvedValue({ data: mockEmailResponse });

      await expect(ProviderRepository.getPrimaryEmail('mocked-access-token')).rejects.toThrowError();
    });
  });

  describe('getUserInfo', () => {
    it('should return user information from the GitHub API', async () => {
      const mockUserResponse: GitHubUserResponse = {
        login: 'octocat',
        id: 1,
        node_id: 'MDQ6VXNlcjE=',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        gravatar_id: '',
        url: 'https://api.github.com/users/octocat',
        html_url: 'https://github.com/octocat',
        followers_url: 'https://api.github.com/users/octocat/followers',
        following_url: 'https://api.github.com/users/octocat/following{/other_user}',
        gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
        organizations_url: 'https://api.github.com/users/octocat/orgs',
        repos_url: 'https://api.github.com/users/octocat/repos',
        events_url: 'https://api.github.com/users/octocat/events{/privacy}',
        received_events_url: 'https://api.github.com/users/octocat/received_events',
        type: 'User',
        site_admin: false,
        name: 'The Octocat',
        company: 'GitHub',
        blog: 'https://github.com/blog',
        location: 'San Francisco',
        email: 'octocat@github.com',
        hireable: null,
        bio: 'There once was...',
        twitter_username: 'octocat',
        public_repos: 2,
        public_gists: 1,
        followers: 20,
        following: 0,
        created_at: '2008-01-14T04:33:35Z',
        updated_at: '2008-01-14T04:33:35Z',
        two_factor_authentication: true,
      };

      //mockedAxios.get.mockResolvedValue({ data: mockUserResponse });

      const userInfo = await ProviderRepository.getUserInfo('mocked-access-token');

      expect(userInfo.login).toBe('octocat');
      expect(typeof userInfo.login).toBe('string');
      expect(userInfo).toMatchObject(mockUserResponse);
    });

    it('should throw an error if GitHub API returns an error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(ProviderRepository.getUserInfo('mocked-access-token')).rejects.toThrow('API Error');
    });
  });
});
