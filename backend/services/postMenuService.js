const { Post, User } = require('../models');

class PostMenuService {
  async hidePost(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Mettre à jour le statut de visibilité du post
    await post.update({ isHidden: true });
    return true;
  }

  async unhidePost(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Mettre à jour le statut de visibilité du post
    await post.update({ isHidden: false });
    return true;
  }

  async updateVisibility(postId, userId, visibility) {
    const post = await Post.findOne({
      where: { id: postId, authorId: userId }
    });

    if (!post) {
      throw new Error('Post non trouvé ou non autorisé');
    }

    // Mettre à jour la visibilité du post
    await post.update({ visibility });
    return post;
  }

  async reportPost(postId, userId, reason) {
    // Ici, vous pouvez implémenter la logique pour signaler un post
    // Par exemple, créer une entrée dans une table de signalements
    // Pour l'instant, nous retournons juste un succès
    return { success: true, message: 'Post signalé avec succès' };
  }

  async blockUser(userId, blockedUserId) {
    // Ici, vous pouvez implémenter la logique pour bloquer un utilisateur
    // Par exemple, créer une entrée dans une table de blocages
    // Pour l'instant, nous retournons juste un succès
    return { success: true, message: 'Utilisateur bloqué avec succès' };
  }

  async unblockUser(userId, blockedUserId) {
    // Ici, vous pouvez implémenter la logique pour débloquer un utilisateur
    // Pour l'instant, nous retournons juste un succès
    return { success: true, message: 'Utilisateur débloqué avec succès' };
  }

  async getPostMenuOptions(postId, userId) {
    const post = await Post.findByPk(postId, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id']
      }]
    });

    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Déterminer les options disponibles en fonction du contexte
    const isAuthor = post.author.id === userId;
    
    return {
      canEdit: isAuthor,
      canDelete: isAuthor,
      canHide: true,
      canReport: !isAuthor,
      canBlock: !isAuthor,
      canChangeVisibility: isAuthor,
      currentVisibility: post.visibility,
      isHidden: post.isHidden
    };
  }
}

module.exports = new PostMenuService(); 