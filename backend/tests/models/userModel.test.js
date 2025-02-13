const { User } = require('../models');

describe('User Model', () => {
  it('should create a user', async () => {
    const user = await User.create({ email: 'test@example.com', password: 'password' });
    expect(user.email).toBe('test@example.com');
  });
}); 