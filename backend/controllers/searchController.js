const { User, Post, Comment, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q) {
      return res.json([]);
    }

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId },
        [Op.or]: [
          { username: { [Op.iLike]: `%${q}%` } },
          { firstName: { [Op.iLike]: `%${q}%` } },
          { lastName: { [Op.iLike]: `%${q}%` } },
          { title: { [Op.iLike]: `%${q}%` } },
          { company: { [Op.iLike]: `%${q}%` } }
        ]
      },
      attributes: {
        exclude: ['password', 'verificationToken', 'resetPasswordToken'],
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM "UserRelations" WHERE "relatedUserId" = "User"."id")`), 'followersCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "UserRelations" WHERE "userId" = "User"."id")`), 'followingCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "Posts" WHERE "authorId" = "User"."id")`), 'postsCount'],
          [sequelize.literal(`EXISTS(SELECT 1 FROM "UserRelations" WHERE "userId" = ${currentUserId} AND "relatedUserId" = "User"."id")`), 'isFollowing']
        ]
      },
      limit: 20
    });

    res.json(users);
  } catch (error) {
    console.error('searchUsers - Erreur:', error);
    res.status(500).json({ 
      message: "Erreur lors de la recherche d'utilisateurs",
      error: error.message 
    });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;
    
    if (!q) {
      return res.json([]);
    }

    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { content: { [Op.iLike]: `%${q}%` } },
          { '$author.username$': { [Op.iLike]: `%${q}%` } }
        ],
        visibility: 'public'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture', 'title']
        },
        {
          model: Post,
          as: 'originalPost',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json(posts);
  } catch (error) {
    console.error('searchPosts - Erreur:', error);
    res.status(500).json({ 
      message: "Erreur lors de la recherche de posts",
      error: error.message 
    });
  }
};

exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q) {
      return res.json({
        users: [],
        posts: [],
        comments: []
      });
    }

    const [users, posts, comments] = await Promise.all([
      User.findAll({
        where: {
          id: { [Op.ne]: currentUserId },
          [Op.or]: [
            { username: { [Op.iLike]: `%${q}%` } },
            { firstName: { [Op.iLike]: `%${q}%` } },
            { lastName: { [Op.iLike]: `%${q}%` } }
          ]
        },
        attributes: ['id', 'username', 'profilePicture', 'title'],
        limit: 5
      }),
      Post.findAll({
        where: {
          [Op.or]: [
            { content: { [Op.iLike]: `%${q}%` } }
          ],
          visibility: 'public'
        },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        }],
        limit: 5
      }),
      Comment.findAll({
        where: {
          content: { [Op.iLike]: `%${q}%` }
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          },
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'content']
          }
        ],
        limit: 5
      })
    ]);

    res.json({
      users,
      posts,
      comments
    });
  } catch (error) {
    console.error('searchAll - Erreur:', error);
    res.status(500).json({ 
      message: "Erreur lors de la recherche",
      error: error.message 
    });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Récupérer les utilisateurs que l'utilisateur courant ne suit pas encore
    const suggestions = await User.findAll({
      where: {
        id: {
          [Op.ne]: currentUserId,
          [Op.notIn]: sequelize.literal(`(
            SELECT "relatedUserId"
            FROM "UserRelations"
            WHERE "userId" = ${currentUserId}
          )`)
        }
      },
      attributes: {
        exclude: ['password', 'verificationToken', 'resetPasswordToken'],
        include: [
          [sequelize.literal(`(
            SELECT COUNT(*)
            FROM "UserRelations" ur1
            JOIN "UserRelations" ur2 ON ur1."userId" = ur2."relatedUserId"
            WHERE ur1."relatedUserId" = "User"."id"
            AND ur2."userId" = ${currentUserId}
          )`), 'mutualConnections']
        ]
      },
      order: [[sequelize.literal('"mutualConnections"'), 'DESC']],
      limit: 10
    });

    res.json(suggestions);
  } catch (error) {
    console.error('getSuggestions - Erreur:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des suggestions",
      error: error.message 
    });
  }
}; 