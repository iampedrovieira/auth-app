
import { Request} from 'express-serve-static-core';

export const mockRequest = {
  body: {
    username: 'teste',
    password: 'teste'
  },
  headers: {
     'content-type': 'application/json'
  }
} as Request;