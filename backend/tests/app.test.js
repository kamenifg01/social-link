const request = require('supertest');
const app = require('../app');

describe('GET /api/posts', () => {
  it('should return a list of posts', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
}); 