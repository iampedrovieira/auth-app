import { mockResponse } from "../../__mocks__/response/mocksResponse";
import { mockRequest } from "../../__mocks__/requests/mocksLoginRequests";
import { login } from "../../routes/handlers/login";


describe('login function', () => {
    
  afterEach(() => {
    
    jest.clearAllMocks();
  });
    
    it('Simple unit test with db connection', async () => {
      await login(mockRequest,mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({"msg": "Invalid credentials"});
    })
  
  
});
