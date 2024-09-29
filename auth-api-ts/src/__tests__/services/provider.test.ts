import { ProviderRepository } from '../../services/providerService';
import axios from 'axios';
import { GithubTokenResponse, GithubEmailResponse, GitHubUserResponse } from '../../types/user';

//temp
interface AxiosResponse<T> {
    data: T;
  }
describe('ProviderRepository', () => {
  describe('getProviderToken', () => {
    it('should return the access token from the GitHub API', async () => {
      // Mock da resposta do GitHub com o tipo correto
      const mockTokenResponse:GithubTokenResponse = {
            access_token: 'mocked-access-token',
            token_type: 'bearer',
            scope: 'repo,gist',
      };

      (axios.post as jest.Mock).mockResolvedValue({ data: mockTokenResponse });
      const token = await ProviderRepository.getProviderToken('mock-code');
      
      expect(token).toBe('mocked-access-token');
      expect(typeof token).toBe('string');
    });
  });
  describe('getPrimaryEmail', () => {
    it('should return the primary email from the GitHub API', async () => {
      const mockEmailResponse:GithubEmailResponse = [
        { email: 'mocked-email', primary: true, verified: true, visibility: 'public' },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockEmailResponse });
      const email = await ProviderRepository.getPrimaryEmail('mock-token');
      expect(email).toBe('mocked-email');
      expect(typeof email).toBe('string');
    });
  }
  );
  describe('getUserInfo', () => {
    it('should return the user info from the GitHub API', async () => {
      const mockUserResponse:GitHubUserResponse = {
        login: 'mocked-login',
        id: 1,
        node_id: 'mocked-node-id',
        avatar_url: 'mocked-avatar-url',
        gravatar_id: '',
        url: 'mocked-url',
        html_url: 'mocked-html-url',
        followers_url: 'mocked-followers-url',
        following_url: 'mocked-following-url',
        gists_url: 'mocked-gists-url',
        starred_url: 'mocked-starred-url',
        subscriptions_url: 'mocked-subscriptions-url',
        organizations_url: 'mocked-organizations-url',
        repos_url: 'mocked-repos-url',
        events_url: 'mocked-events-url',
        received_events_url: 'mocked-received-events-url',
        type: 'User',
        site_admin: false,
        name: 'mocked-name',
        company: 'mocked-company',
        blog: 'mocked-blog',
        location: 'mocked-location',
        email: 'mocked-email',
        hireable: false,
        bio: 'mocked-bio',
        twitter_username: 'mocked-twitter-username',
        public_repos: 1,
        public_gists: 1,
        followers: 1,
        following: 1,
        created_at: 'mocked-created-at',
        updated_at: 'mocked-updated-at',
        two_factor_authentication: false,
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockUserResponse });
      const user = await ProviderRepository.getUserInfo('mock-token');
      expect(user).toEqual(mockUserResponse);
    });
  });
  
});
