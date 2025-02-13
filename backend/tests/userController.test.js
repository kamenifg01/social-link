const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  it('should sign up a new user', async () => {
    const newUser = { email: 'test@example.com', password: 'password' };
    const response = await request(app).post('/api/users/signup').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(newUser.email);
  });

  it('should log in a user', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    const response = await request(app).post('/api/users/login').send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  it('should get user profile', async () => {
    const response = await request(app).get('/api/users/profile').set('Authorization', 'Bearer fake-jwt-token');
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });
}); 