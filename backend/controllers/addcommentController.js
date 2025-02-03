exports.addComment = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id;
  
    try {
      const post = await db.Post.findByPk(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post non trouvé" });
      }
  
      const comment = await db.Comment.create({
        content,
        userId,
        postId,
      });
  
      // Créer une notification pour l'auteur du post
      if (post.userId !== userId) {
        await db.Notification.create({
          type: "comment",
          message: `Un nouveau commentaire a été ajouté à votre post : "${post.title}"`,
          userId: post.userId,
        });
      }
  
      res.status(201).json({ message: "Commentaire ajouté avec succès", comment });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error });
    }
  };
  