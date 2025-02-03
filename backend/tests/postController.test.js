const request = require('supertest');
const app = require('../app');

describe('Post API', () => {
  it('should fetch all posts', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should fetch a post by id', async () => {
    const response = await request(app).get('/api/posts/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should create a new post', async () => {
    const newPost = { title: 'New Post', content: 'Content of the new post' };
    const response = await request(app).post('/api/posts').send(newPost);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newPost.title);
  });

  it('should update a post', async () => {
    const updatedPost = { title: 'Updated Post' };
    const response = await request(app).put('/api/posts/1').send(updatedPost);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedPost.title);
  });

  it('should delete a post', async () => {
    const response = await request(app).delete('/api/posts/1');
    expect(response.statusCode).toBe(204);
  });
}); 