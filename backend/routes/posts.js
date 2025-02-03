const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
<<<<<<< Updated upstream
  getUserPosts
=======
  getUserPosts,
  likePost,
  getPostReactions
>>>>>>> Stashed changes
} = require("../controllers/postController");
const authenticate = require("../middleware/authMiddleware");

// Obtenir tous les posts
router.get("/", authenticate, getAllPosts);

// Obtenir les posts d'un utilisateur
router.get("/user/:userId?", authenticate, getUserPosts);

<<<<<<< Updated upstream
// Créer un nouveau post
router.post("/", authenticate, createPost);

=======
// Obtenir les réactions d'un post
router.get("/:id/reactions", authenticate, getPostReactions);

// Créer un nouveau post
router.post("/", authenticate, createPost);

// Réagir à un post
router.post("/:id/like", authenticate, likePost);

>>>>>>> Stashed changes
// Modifier un post existant
router.put("/:id", authenticate, updatePost);

// Supprimer un post
router.delete("/:id", authenticate, deletePost);

module.exports = router;
