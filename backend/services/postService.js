const { Post, User, Comment, Notification, Reaction, UserRelation } = require('../models');
const { Op, Sequelize } = require('sequelize');

class PostService {
  async getAllPosts() {
    return await Post.findAll({
      attributes: ['id', 'content', 'mediaType', 'mediaUrl', 'mediaMetadata', 'metrics', 'authorId', 'originalPostId', 'isHidden', 'visibility', 'type', 'shareUrl', 'shareMetadata', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Post,
          as: 'originalPost',
          attributes: ['id', 'content', 'mediaType', 'mediaUrl', 'mediaMetadata', 'metrics', 'authorId', 'visibility', 'type', 'createdAt'],
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async getPostById(id) {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
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
          model: Comment,
          as: 'comments',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        },
        {
          model: Reaction,
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ]
    });

    if (!post) {
      throw new Error('Post non trouvé');
    }

    return post;
  }

  async updatePost(id, data) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    await post.update(data);
    return await this.getPostById(id);
  }

  async deletePost(id) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    await post.destroy();
  }

  async createPost(userId, postData) {
    try {
      // Vérifier si le post contient un média
      let mediaUrl = null;
      if (postData.media) {
        mediaUrl = postData.media.path.replace(/\\/g, '/');
        // S'assurer que l'URL commence par /uploads/
        if (!mediaUrl.startsWith('/uploads/')) {
          mediaUrl = '/uploads/' + mediaUrl;
        }
      }

      const post = await Post.create({
        content: postData.content,
        mediaUrl: mediaUrl,
        mediaType: postData.media ? (postData.media.mimetype.startsWith('image/') ? 'image' : 'video') : null,
        visibility: postData.visibility || 'public',
        authorId: userId,
        metrics: {
          likes: 0,
          comments: 0,
          shares: 0,
          reactions: {}
        },
        type: 'original',
        isHidden: false,
        shareMetadata: {
          platform: null,
          originalUrl: null,
          sharedAt: null,
          engagement: 0
        }
      });

      // Récupérer le post avec les relations
      return await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture', 'title']
          }
        ]
      });
    } catch (error) {
      console.error('Erreur création post:', error);
      throw error;
    }
  }

  async getPost(postId, userId) {
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture', 'title']
        },
        {
          model: Reaction,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'profilePicture']
            }
          ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'profilePicture']
            },
            {
              model: Reaction,
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'username']
                }
              ]
            }
          ]
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
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM "Reactions" WHERE "postId" = "Post"."id")`), 'reactionsCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM "Comments" WHERE "postId" = "Post"."id")`), 'commentsCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM "Posts" WHERE "originalPostId" = "Post"."id" AND "type" = 'share')`), 'sharesCount'],
          [Sequelize.literal(`EXISTS(SELECT 1 FROM "Reactions" WHERE "postId" = "Post"."id" AND "userId" = ${userId})`), 'isReacted']
        ]
      }
    });

    if (!post) throw new Error('Post not found');
    return post;
  }

  async getFeed(userId, page = 1, limit = 10) {
    try {
      console.log('getFeed - Début avec params:', { userId, page, limit });
      
      const offset = (page - 1) * limit;
      
      // Récupérer les relations de l'utilisateur
      const userRelations = await UserRelation.findAll({
        where: {
          [Op.or]: [
            { userId: userId },
            { relatedUserId: userId }
          ],
          status: 'accepted'
        }
      });

      // Extraire les IDs des utilisateurs connectés
      const connectedUserIds = userRelations.reduce((ids, relation) => {
        if (relation.userId === userId) {
          ids.push(relation.relatedUserId);
        } else {
          ids.push(relation.userId);
        }
        return ids;
      }, []);

      // Ajouter l'ID de l'utilisateur courant
      connectedUserIds.push(userId);
      
      console.log('getFeed - IDs des utilisateurs connectés:', connectedUserIds);

      // Construire la condition WHERE en fonction des relations
      const whereCondition = {
        [Op.or]: [
          // Posts de l'utilisateur connecté (tous les posts)
          {
            authorId: userId
          },
          // Posts des utilisateurs connectés (public et connections)
          {
            [Op.and]: [
              { authorId: { [Op.in]: connectedUserIds } },
              { visibility: { [Op.in]: ['public', 'connections'] } }
            ]
          },
          // Posts publics des autres utilisateurs
          {
            [Op.and]: [
              { authorId: { [Op.notIn]: connectedUserIds } },
              { visibility: 'public' }
            ]
          }
        ]
      };

      const { rows: posts, count: total } = await Post.findAndCountAll({
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

      return { 
        posts, 
        total, 
        page, 
        totalPages: Math.ceil(total / limit),
        hasMore: offset + posts.length < total
      };
    } catch (error) {
      console.error('getFeed - Erreur:', error);
      throw error;
    }
  }

  async likePost(postId, userId) {
    const [reaction, created] = await Reaction.findOrCreate({
      where: { 
        postId, 
        userId,
        type: 'like'
      }
    });

    if (created) {
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: User,
            as: 'author'
          }
        ]
      });

      // Créer une notification pour l'auteur du post
      if (post.authorId !== userId) {
        await Notification.create({
          type: 'REACTION',
          userId: post.authorId,
          actorId: userId,
          postId,
          read: false
        });
      }
    }

    return reaction;
  }

  async unlikePost(postId, userId) {
    const deleted = await Reaction.destroy({
      where: { 
        postId, 
        userId,
        type: 'like'
      }
    });
    return deleted > 0;
  }

  async commentOnPost(postId, userId, content) {
    const comment = await Comment.create({
      postId,
      authorId: userId,
      content
    });

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author'
        }
      ]
    });

    // Créer une notification pour l'auteur du post
    if (post.authorId !== userId) {
      await Notification.create({
        type: 'COMMENT',
        userId: post.authorId,
        actorId: userId,
        postId,
        read: false
      });
    }

    return await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        }
      ]
    });
  }

  async sharePost(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    const share = await Post.create({
      type: 'share',
      originalPostId: postId,
      authorId: userId
    });

    // Créer une notification pour l'auteur du post
    if (post.authorId !== userId) {
      await Notification.create({
        type: 'SHARE',
        userId: post.authorId,
        actorId: userId,
        postId,
        read: false
      });
    }

    return share;
  }

  async unsharePost(postId, userId) {
    const deleted = await Post.destroy({
      where: { 
        originalPostId: postId,
        authorId: userId,
        type: 'share'
      }
    });
    return deleted > 0;
  }

  async deletePost(postId, userId) {
    const post = await Post.findOne({
      where: { 
        id: postId,
        authorId: userId
      }
    });

    if (!post) throw new Error('Post not found or unauthorized');

    await post.destroy();
    return true;
  }

  async getPostReactions(postId) {
    const reactions = await Reaction.findAll({
      where: { postId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Grouper les réactions par type
    const reactionsByType = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = [];
      }
      acc[reaction.type].push({
        id: reaction.id,
        user: reaction.user,
        createdAt: reaction.createdAt
      });
      return acc;
    }, {});

    return {
      total: reactions.length,
      byType: reactionsByType
    };
  }
}

module.exports = new PostService(); 