const { User } = require('../models');
const userService = require('../services/userService');
const { Op } = require('sequelize');
const { Post } = require('../models');
const { UserRelation } = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Notification } = require('../models');
const { Reaction } = require('../models');

exports.signup = async (req, res) => {
  try {
    const user = await userService.signup(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { 
        exclude: ['password'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "authorId" = "User"."id")'), 'postsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "relatedUserId" = "User"."id")'), 'followersCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "userId" = "User"."id")'), 'followingCount'],
          [sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "UserRelations" ur1
            JOIN "UserRelations" ur2 ON ur1."userId" = ur2."relatedUserId" AND ur1."relatedUserId" = ur2."userId"
            WHERE ur1."userId" = "User"."id"
          )`), 'mutualConnectionsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "Reactions" WHERE "userId" = "User"."id")'), 'reactionsCount']
        ]
      },
      include: [
        {
          model: Post,
          as: 'posts',
          separate: true,
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'profilePicture']
            },
            {
              model: Reaction,
              as: 'reactions',
              attributes: ['type', 'userId'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'username', 'profilePicture']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Ajouter des informations supplémentaires
    const userResponse = user.toJSON();
    userResponse.isComplete = !!(
      user.username && 
      user.profilePicture && 
      user.title && 
      user.bio
    );

    res.json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, title, company, location, bio } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.update({
      username: username || user.username,
      title: title || user.title,
      company: company || user.company,
      location: location || user.location,
      bio: bio || user.bio
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.destroy();
    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q || '';
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'username', 'email', 'title', 'company', 'location', 'bio', 'profilePicture']
    });
    res.json(users);
  } catch (error) {
    console.error('Erreur recherche utilisateurs:', error);
    res.status(500).json({ message: "Erreur lors de la recherche d'utilisateurs" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ['password'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "authorId" = "User"."id")'), 'postsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "relatedUserId" = "User"."id")'), 'followersCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "userId" = "User"."id")'), 'followingCount'],
          [sequelize.literal(`(SELECT COUNT(*) > 0 FROM "UserRelations" WHERE "userId" = ${currentUserId} AND "relatedUserId" = "User"."id")`), 'isFollowing']
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log('getUserPosts - Paramètres:', { userId, currentUserId, page, limit });

    // Vérification de l'ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "ID utilisateur invalide"
      });
    }

    // Vérifier si l'utilisateur consulte son propre profil
    const isOwnProfile = userId === currentUserId;

    // Vérifier s'il existe une connexion entre les utilisateurs
    let hasConnection = false;
    if (!isOwnProfile) {
      const connection = await UserRelation.findOne({
        where: {
          [Op.or]: [
            { userId: currentUserId, relatedUserId: userId },
            { userId: userId, relatedUserId: currentUserId }
          ],
          status: 'accepted'
        }
      });
      hasConnection = !!connection;
    }

    console.log('getUserPosts - État:', { isOwnProfile, hasConnection });

    // Construire la condition where
    let whereCondition = {
      authorId: userId
    };

    if (!isOwnProfile) {
      whereCondition = {
        authorId: userId,
        [Op.or]: [
          { visibility: 'public' },
          ...(hasConnection ? [{ visibility: 'connections' }] : [])
        ]
      };
    }

    console.log('getUserPosts - Condition WHERE:', JSON.stringify(whereCondition, null, 2));

    const posts = await Post.findAndCountAll({
      where: whereCondition,
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
        },
        {
          model: Reaction,
          as: 'reactions',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    console.log('getUserPosts - Nombre de posts trouvés:', posts.count);

    res.json({
      success: true,
      posts: posts.rows,
      totalPosts: posts.count,
      currentPage: page,
      totalPages: Math.ceil(posts.count / limit),
      hasMore: offset + posts.rows.length < posts.count,
      isOwnProfile,
      hasConnection
    });
  } catch (error) {
    console.error('getUserPosts - Erreur:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des posts",
      error: error.message
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'title', 'company', 'location', 'bio', 'profilePicture']
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (id === currentUserId.toString()) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même" });
    }

    const [relation, created] = await UserRelation.findOrCreate({
      where: {
        userId: currentUserId,
        relatedUserId: id
      },
      defaults: {
        status: 'accepted'
      }
    });

    if (!created) {
      return res.status(400).json({ message: "Vous suivez déjà cet utilisateur" });
    }

    await User.increment('followingCount', { where: { id: currentUserId } });
    await User.increment('followersCount', { where: { id } });

    res.status(201).json({ message: "Utilisateur suivi avec succès" });
  } catch (error) {
    console.error('Erreur lors du suivi:', error);
    res.status(500).json({ message: "Erreur lors du suivi de l'utilisateur" });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const relation = await UserRelation.findOne({
      where: {
        userId: currentUserId,
        relatedUserId: id
      }
    });

    if (!relation) {
      return res.status(404).json({ message: "Vous ne suivez pas cet utilisateur" });
    }

    await relation.destroy();

    await User.decrement('followingCount', { where: { id: currentUserId } });
    await User.decrement('followersCount', { where: { id } });

    res.json({ message: "Vous ne suivez plus cet utilisateur" });
  } catch (error) {
    console.error('Erreur lors du unfollow:', error);
    res.status(500).json({ message: "Erreur lors du unfollow" });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await UserRelation.findAll({
      where: { relatedUserId: userId },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }]
    });

    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Erreur lors de la récupération des followers:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des followers" });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await UserRelation.findAll({
      where: { userId },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }]
    });

    res.json(following.map(f => f.following));
  } catch (error) {
    console.error('Erreur lors de la récupération des following:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des following" });
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const followers = await UserRelation.findAll({
      where: { relatedUserId: id },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }]
    });

    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Erreur récupération followers:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des followers" });
  }
};

exports.getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const following = await UserRelation.findAll({
      where: { userId: id },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }]
    });

    res.json(following.map(f => f.following));
  } catch (error) {
    console.error('Erreur récupération following:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des abonnements" });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les IDs des utilisateurs déjà suivis
    const following = await UserRelation.findAll({
      where: { userId },
      attributes: ['relatedUserId']
    });
    const followingIds = following.map(f => f.relatedUserId);
    
    // Exclure l'utilisateur actuel et les utilisateurs déjà suivis
    const suggestions = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [userId, ...followingIds]
        }
      },
      attributes: ['id', 'username', 'profilePicture', 'title'],
      limit: 10,
      order: sequelize.random()
    });

    res.json(suggestions);
  } catch (error) {
    console.error('Erreur suggestions:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des suggestions" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

exports.getMutualConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Trouver les utilisateurs qui nous suivent et que nous suivons
    const mutualConnections = await UserRelation.findAll({
      where: {
        userId: userId
      },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'profilePicture', 'title'],
        include: [{
          model: UserRelation,
          as: 'followers',
          where: {
            userId: sequelize.col('following.id'),
            relatedUserId: userId
          },
          required: true
        }]
      }],
      attributes: []
    });

    res.json(mutualConnections.map(connection => connection.following));
  } catch (error) {
    console.error('Erreur lors de la récupération des relations mutuelles:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des relations mutuelles" });
  }
};

exports.getFollowStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // Validation de l'ID
    if (!id) {
      return res.status(400).json({ message: "ID de l'utilisateur requis" });
    }

    // Vérification si l'utilisateur cible existe
    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (id === currentUserId.toString()) {
      return res.json({ isFollowing: false, isSelf: true });
    }

    const [relation, reverseRelation] = await Promise.all([
      UserRelation.findOne({
        where: {
          userId: currentUserId,
          relatedUserId: id
        }
      }),
      UserRelation.findOne({
        where: {
          userId: id,
          relatedUserId: currentUserId
        }
      })
    ]);

    res.json({
      isFollowing: !!relation,
      isFollowedBy: !!reverseRelation,
      isSelf: false,
      user: {
        id: targetUser.id,
        username: targetUser.username,
        profilePicture: targetUser.profilePicture,
        title: targetUser.title
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de suivi:', error);
    res.status(500).json({ 
      message: "Erreur lors de la vérification du statut de suivi",
      error: error.message 
    });
  }
};

exports.getPendingInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const pendingInvitations = await UserRelation.findAll({
      where: {
        relatedUserId: userId,
        status: 'pending'
      },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }]
    });

    res.json({
      data: pendingInvitations.map(invitation => ({
        id: invitation.follower.id,
        username: invitation.follower.username,
        profilePicture: invitation.follower.profilePicture,
        title: invitation.follower.title,
        createdAt: invitation.createdAt
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des invitations:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des invitations",
      error: error.message 
    });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user.id;

    const invitation = await UserRelation.findOne({
      where: {
        userId: senderId,
        relatedUserId: receiverId,
        status: 'pending'
      }
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation non trouvée" });
    }

    await invitation.update({ status: 'accepted' });

    // Créer une notification pour l'expéditeur
    await Notification.create({
      type: 'INVITATION_ACCEPTED',
      message: `${req.user.username} a accepté votre invitation`,
      userId: senderId,
      senderId: receiverId,
      isRead: false
    });

    res.json({ message: "Invitation acceptée avec succès" });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
    res.status(500).json({ 
      message: "Erreur lors de l'acceptation de l'invitation",
      error: error.message 
    });
  }
};

exports.declineInvitation = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user.id;

    const invitation = await UserRelation.findOne({
      where: {
        userId: senderId,
        relatedUserId: receiverId,
        status: 'pending'
      }
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation non trouvée" });
    }

    await invitation.destroy();

    res.json({ message: "Invitation refusée avec succès" });
  } catch (error) {
    console.error('Erreur lors du refus de l\'invitation:', error);
    res.status(500).json({ 
      message: "Erreur lors du refus de l'invitation",
      error: error.message 
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    console.log('getUserProfile - Récupération du profil pour userId:', userId);

    const user = await User.findByPk(userId, {
      attributes: { 
        exclude: ['password'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "authorId" = "User"."id")'), 'postsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "relatedUserId" = "User"."id")'), 'followersCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM "UserRelations" WHERE "userId" = "User"."id")'), 'followingCount']
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    // Vérifier s'il existe une connexion entre les utilisateurs
    const hasConnection = await UserRelation.findOne({
      where: {
        [Op.or]: [
          { userId: req.user.id, relatedUserId: userId },
          { userId: userId, relatedUserId: req.user.id }
        ],
        status: 'accepted'
      }
    });

    const userResponse = {
      ...user.toJSON(),
      isOwnProfile: req.user.id === user.id,
      hasConnection: !!hasConnection
    };

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('getUserProfile - Erreur:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message 
    });
  }
}; 