import { mockResponse } from "../../__mocks__/response/mocksResponse";
import { loginMockRequest} from "../../__mocks__/requests/mocksLoginRequests";
import { login } from "../../routes/handlers/login";
import { Request, Response } from 'express';
import { UserRepository } from '../../services/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../services/userService', () => ({
  UserRepository: {
    getUserByUsername: jest.fn(),
    updateUserToken: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

let req: Partial<Request>;
let res: Partial<Response>;
let client;

describe('Login function with JSON data', () => {
	
  beforeEach(() => {
    req = {...loginMockRequest};
    res = {...mockResponse};
		client = {
      query: jest.fn(),
    };
  });

	afterEach(() => {
    jest.clearAllMocks();
  });
  
	it('should return 400 if username or password is missing', async () => {
    req.body = { username: '', password: '' };
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Bad Request' });
  });

	it('should return 400 if password is missing', async () => {
    req.body = { username: 'test', password: '' };
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Bad Request' });
  });

	it('should return 400 if username is missing', async () => {
    req.body = { username: '', password: 'teste' };
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Bad Request' });
  });

	it('should return 401 if user is not found', async () => {
    (UserRepository.getUserByUsername as jest.Mock).mockResolvedValue({ rowCount: 0 });
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
  });

	it('should return 401 if password is invalid', async () => {
    (UserRepository.getUserByUsername as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ password_hash: 'hashedpassword' }] });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
  });
	
	it('should return 200 and a token if login is successful', async () => {
		
    (UserRepository.getUserByUsername as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ password_hash: 'hashedPassword', name: 'Test User', email: 'test@example.com', username: 'test' }] });
    (UserRepository.updateUserToken as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ password_hash: 'hashedPassword', name: 'Test User', email: 'test@example.com', username: 'test' }] });
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockedToken');
    req.body = { username: 'test', password: 'hashedPassword'  };
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'OK', token: 'mockedToken' });
    expect(res.cookie).toHaveBeenCalledWith('token', 'mockedToken', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
  });

  it('should return 500 if there is an internal server error', async () => {
    (UserRepository.getUserByUsername as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));
    req.body = { username: 'test', password: 'test' };
    await login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Internal Error' });
  });

});

describe('login function with form data', () => {

	beforeEach(() => {
		req = {...loginMockRequest};
		res = {...mockResponse};
		client = {
			query: jest.fn(),
		};
		req.headers = {'content-type':'application/x-www-form-urlencoded'};
		
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return 400 if username or password is missing', async () => {
		req.body = { username: '', password: '' };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.render).toHaveBeenCalledWith('login', {'msg': 'Bad Request'});
	});

	it('should return 400 if password is missing', async () => {
		req.body = { username: 'test', password: '' };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.render).toHaveBeenCalledWith('login',{ 'msg': 'Bad Request'});
	});

	it('should return 400 if username is missing', async () => {
		req.body = { username: '', password: 'teste' };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.render).toHaveBeenCalledWith('login',{ 'msg': 'Bad Request'});
	});

	it('should return 401 if user is not found', async () => {
		(UserRepository.getUserByUsername as jest.Mock).mockResolvedValue({ rowCount: 0 });
		req.body = { username: 'test', password: 'test' };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.render).toHaveBeenCalledWith('login',{ 'msg': 'Invalid credentials', 'username': 'test' });
	});

	it('should return 401 if password is invalid', async () => {
		(UserRepository.getUserByUsername as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ password_hash: 'hashedpassword' }] });
		(bcrypt.compare as jest.Mock).mockResolvedValue(false);
		req.body = { username: 'test', password: 'wrongpassword' };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.render).toHaveBeenCalledWith('login',{ 'msg': 'Invalid credentials', 'username': 'test' });
	});

	it('should return 200 and a token if login is successful', async () => {
		(UserRepository.getUserByUsername as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ password_hash: 'hashedPassword', name: 'Test User', email: 'test@example.com', username: 'test' }] });
		(UserRepository.updateUserToken as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ password_hash: 'hashedPassword', name: 'Test User', email: 'test@example.com', username: 'test' }] });
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);
		(jwt.sign as jest.Mock).mockReturnValue('mockedToken');
		req.body = { username: 'test', password: 'hashedPassword'  };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ msg: 'OK', token: 'mockedToken' });
    expect(res.cookie).toHaveBeenCalledWith('token', 'mockedToken', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
	});

	it('should return 500 if there is an internal server error', async () => {
		(UserRepository.getUserByUsername as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));
		req.body = { username: 'test', password: 'test' };
		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.render).toHaveBeenCalledWith('login',{ 'msg': 'Internal Error' });
	});
});
