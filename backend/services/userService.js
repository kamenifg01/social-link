const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await User.create({
    ...userData,
    password: hashedPassword
  });
  return user;
};

exports.login = async (credentials) => {
  const user = await User.findOne({ where: { email: credentials.email } });
  if (!user) throw new Error('Invalid credentials');

  const validPassword = await bcrypt.compare(credentials.password, user.password);
  if (!validPassword) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  return token;
};

exports.getProfile = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'username', 'email', 'title', 'company', 'location', 'bio']
  });
  if (!user) throw new Error('User not found');
  return user;
};

exports.updateProfile = async (userId, profileData) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  await user.update(profileData);
  return user;
};

exports.deleteAccount = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  
  await user.destroy();
  return true;
}; 