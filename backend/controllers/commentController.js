const { Comment } = require("../models");

exports.createComment = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  try {
    const comment = await Comment.create({ content, postId, userId: req.user.id });
    res.status(201).json({ message: "Commentaire créé avec succès", comment });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du commentaire", error: error.message });
  }
};
exports.updateComment = async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (comment.userId !== req.user.id) return res.status(403).json({ message: "Accès refusé" });
    try {
        comment.content = req.body.content;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire", error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (comment.userId !== req.user.id) return res.status(403).json({ message: "Accès refusé" });
    try {
        await comment.destroy();
        res.json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du commentaire", error: error.message });
    }
};
    
