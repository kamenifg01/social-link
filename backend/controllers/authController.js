const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.signup = async (req, res) => {
  try {
    console.log('Tentative d\'inscription - Données reçues:', {
      hasUsername: !!req.body.username,
      email: req.body.email,
      hasPassword: !!req.body.password,
      body: req.body
    });

    const { email, password, username } = req.body;

    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Générer un username par défaut si non fourni
    const defaultUsername = username || email.split('@')[0];

    // Vérifier si le username existe déjà
    const existingUsername = await User.findOne({ where: { username: defaultUsername } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Ce nom d\'utilisateur est déjà pris'
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Création de l\'utilisateur:', {
      email,
      username: defaultUsername
    });

    // Création de l'utilisateur
    const user = await User.create({
      username: defaultUsername,
      email,
      password: hashedPassword,
      isVerified: false,
      status: 'active'
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Exclure le mot de passe de la réponse
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified
    };

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Erreur signup détaillée:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Gestion spécifique des erreurs
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion - Données reçues:', { 
      email, 
      hasPassword: !!password,
      body: req.body 
    });

    // Validation des entrées
    if (!email || !password) {
      console.log('Validation échouée:', { 
        hasEmail: !!email, 
        hasPassword: !!password 
      });
      return res.status(400).json({ 
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'username', 'password', 'isVerified', 'status', 'firstName', 'lastName', 'profilePicture']
    });

    // Vérification de l'existence de l'utilisateur
    if (!user) {
      console.log('Utilisateur non trouvé:', email);
      return res.status(401).json({ 
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Mot de passe invalide pour:', email);
      return res.status(401).json({ 
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Création du token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    // Mise à jour de la dernière connexion
    await User.update(
      { lastLoginAt: new Date() },
      { where: { id: user.id } }
    );

    // Préparation des données utilisateur (sans le mot de passe)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified
    };

    console.log('Connexion réussie pour:', email);

    // Envoi de la réponse avec la structure attendue
    return res.json({ 
      success: true,
      message: "Connexion réussie",
      token: token,
      user: userData
    });

  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({ 
      success: false,
      message: "Une erreur est survenue lors de la connexion",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: "Token requis." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const newToken = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    console.error('Erreur refresh token:', error);
    res.status(500).json({ message: 'Erreur lors du rafraîchissement du token' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Dans une implémentation simple, le client doit simplement supprimer le token
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error('Erreur logout:', error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Générer un token de réinitialisation
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Dans une vraie application, envoyez un email avec le lien de réinitialisation
    // Pour l'exemple, on renvoie simplement le token
    res.status(200).json({
      message: "Instructions de réinitialisation envoyées par email",
      resetToken // À supprimer en production
    });
  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error('Erreur reset password:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Le token de réinitialisation a expiré" });
    }
    res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token de vérification requis" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Marquer l'email comme vérifié
    await user.update({ emailVerified: true });

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (error) {
    console.error('Erreur verification email:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Le token de vérification a expiré" });
    }
    res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    // L'utilisateur est déjà vérifié par le middleware auth
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'profilePicture', 'isVerified']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Erreur checkAuth:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'authentification'
    });
  }
}; 