
import { createApp } from '../createApp';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

describe('Temp Integration tests', () => {
  let app:Express;
  const PORT = process.env.API_PORT
  beforeAll(() => {
    app = createApp();
  });
  it('Test if API is running by calling status endpoint', async () => { 
    console.log(`http://localhost:${PORT}`);
    const response = await request(`http://localhost:${PORT}`).get('/api/status');
    expect(response.status).toBe(200);
  });
  it('Test if DB is running by calling status endpoint', async () => { 
    const response = await request(`http://localhost:${PORT}`).get('/api/statusdb');
    expect(response.status).toBe(200);
  });
  
});