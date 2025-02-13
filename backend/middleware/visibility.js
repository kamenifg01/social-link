const { Post, UserRelation } = require('../models');

const checkPostVisibility = async (req, res, next) => {
  try {
    // Si c'est une route de feed, on passe directement
    if (req.path === '/feed') {
      return next();
    }

    const postId = req.params.id;
    const userId = req.user?.id;

    if (!postId) {
      return next();
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    // Si l'utilisateur est l'auteur, il a accès
    if (userId && post.authorId === userId) {
      req.post = post;
      return next();
    }

    // Si le post est public, tout le monde a accès
    if (post.visibility === 'public') {
      req.post = post;
      return next();
    }

    // Si l'utilisateur n'est pas connecté et le post n'est pas public
    if (!userId) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Si le post est privé, seul l'auteur peut y accéder
    if (post.visibility === 'private') {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Si le post est visible par les connexions
    if (post.visibility === 'connections') {
      const relation = await UserRelation.findOne({
        where: {
          userId: post.authorId,
          relatedUserId: userId,
          status: 'accepted'
        }
      });

      if (!relation) {
        return res.status(403).json({ message: "Accès limité aux connexions" });
      }
    }

    req.post = post;
    next();
  } catch (error) {
    console.error('Erreur vérification visibilité:', error);
    res.status(500).json({ message: "Erreur lors de la vérification des droits d'accès" });
  }
};

module.exports = {
  checkPostVisibility
}; 