
import { createApp } from '../createApp';
import { Express } from 'express-serve-static-core';
import request from 'supertest';

describe('POST /login', () => {
  let app:Express;

  beforeAll(() => {
    app = createApp();
  });
  
  it('Simple integration testing', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  })
    
});