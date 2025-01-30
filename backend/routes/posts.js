const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} = require("../controllers/postController");
const authenticate = require("../middleware/authMiddleware");

// Obtenir tous les posts
router.get("/", authenticate, getAllPosts);

// Obtenir les posts d'un utilisateur
router.get("/user/:userId?", authenticate, getUserPosts);

// Créer un nouveau post
router.post("/", authenticate, createPost);

// Modifier un post existant
router.put("/:id", authenticate, updatePost);

// Supprimer un post
router.delete("/:id", authenticate, deletePost);

module.exports = router;
