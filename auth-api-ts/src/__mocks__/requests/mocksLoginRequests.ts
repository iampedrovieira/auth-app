
import { Request} from 'express-serve-static-core';

export const loginMockRequest = {
  body: {
    username: 'teste',
    password: 'teste'
  },
  headers: {
     'content-type': 'application/json'
  }
} as Request;