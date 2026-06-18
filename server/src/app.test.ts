import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('activity API', () => {
  it('reports healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('returns JSON for unknown API routes', async () => {
    const response = await request(app).post('/api/uploads');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
