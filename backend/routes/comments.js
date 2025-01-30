const express = require("express");
const router = express.Router();
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const authenticate = require("../middleware/authMiddleware");

// Ajouter un commentaire
router.post("/:postId", authenticate, createComment);

// Modifier un commentaire
router.put("/:commentId", authenticate, updateComment);

// Supprimer un commentaire
router.delete("/:commentId", authenticate, deleteComment);

module.exports = router;
