const { User, Post, Comment, Like, Share, UserRelation } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op, Sequelize } = require('sequelize');

exports.signup = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await User.create({
    ...userData,
    password: hashedPassword
  });
  return user;
};

exports.login = async (credentials) => {
  const user = await User.findOne({ 
    where: { email: credentials.email },
    include: [
      {
        model: Post,
        as: 'posts',
        attributes: ['id']
      },
      {
        model: User,
        as: 'followers',
        attributes: ['id']
      },
      {
        model: User,
        as: 'following',
        attributes: ['id']
      }
    ]
  });

  if (!user) throw new Error('Invalid credentials');

  const validPassword = await bcrypt.compare(credentials.password, user.password);
  if (!validPassword) throw new Error('Invalid credentials');

  // Mettre à jour la dernière connexion
  await user.update({ lastLogin: new Date() });

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isVerified: user.isVerified,
      title: user.title,
      company: user.company,
      location: user.location
    }
  };
};

exports.getProfile = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: {
      exclude: ['password'],
      include: [
        [Sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "authorId" = "User"."id")'), 'postsCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM "Likes" WHERE "userId" = "User"."id")'), 'likesCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM "Comments" WHERE "authorId" = "User"."id")'), 'commentsCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM "Shares" WHERE "userId" = "User"."id")'), 'sharesCount']
      ]
    },
    include: [
      {
        model: Post,
        as: 'posts',
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Like,
            attributes: ['id', 'userId']
          },
          {
            model: Comment,
            attributes: ['id', 'content', 'createdAt'],
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'profilePicture']
              }
            ]
          }
        ]
      },
      {
        model: User,
        as: 'followers',
        attributes: ['id', 'username', 'profilePicture']
      },
      {
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'profilePicture']
      }
    ]
  });

  if (!user) throw new Error('User not found');
  return user;
};

exports.updateProfile = async (userId, profileData) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // Si le mot de passe est inclus, le hasher
  if (profileData.password) {
    profileData.password = await bcrypt.hash(profileData.password, 10);
  }

  await user.update(profileData);
  
  // Récupérer l'utilisateur mis à jour sans le mot de passe
  const updatedUser = await User.findOne({
    where: { id: userId },
    attributes: { exclude: ['password'] }
  });
  
  return updatedUser;
};

exports.getUserStats = async (userId) => {
  const stats = await User.findOne({
    where: { id: userId },
    attributes: [
      [Sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "authorId" = "User"."id")'), 'postsCount'],
      [Sequelize.literal('(SELECT COUNT(*) FROM "Likes" WHERE "userId" = "User"."id")'), 'likesCount'],
      [Sequelize.literal('(SELECT COUNT(*) FROM "Comments" WHERE "authorId" = "User"."id")'), 'commentsCount'],
      [Sequelize.literal('(SELECT COUNT(*) FROM "Shares" WHERE "userId" = "User"."id")'), 'sharesCount'],
      [Sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "relatedUserId" = "User"."id")'), 'followersCount'],
      [Sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "userId" = "User"."id")'), 'followingCount']
    ]
  });

  return stats;
};

exports.getUserActivity = async (userId) => {
  const activity = await Promise.all([
    Post.findAll({
      where: { authorId: userId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Like,
          attributes: ['id', 'userId']
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'profilePicture']
            }
          ]
        }
      ]
    }),
    Like.findAll({
      where: { userId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'profilePicture']
            }
          ]
        }
      ]
    }),
    Comment.findAll({
      where: { authorId: userId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'profilePicture']
            }
          ]
        }
      ]
    })
  ]);

  return {
    recentPosts: activity[0],
    recentLikes: activity[1],
    recentComments: activity[2]
  };
};

exports.deleteAccount = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  
  await user.destroy();
  return true;
}; 