const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes protégées par l'authentification
router.use(authMiddleware);

// Routes du profil
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

<<<<<<< Updated upstream
=======
// Route de recherche d'utilisateurs
router.get("/search", userController.searchUsers);

>>>>>>> Stashed changes
// Route de suppression de compte
router.delete("/account", userController.deleteAccount);

module.exports = router; 