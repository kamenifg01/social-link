const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide." });
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      username: username || email.split('@')[0],
      email, 
      password: hashedPassword 
    });

    const token = jwt.sign(
      { id: newUser.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Ne pas renvoyer le mot de passe
    const userWithoutPassword = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    res.status(201).json({ 
      message: "Inscription réussie", 
      user: userWithoutPassword, 
      token 
    });

  } catch (error) {
    console.error('Erreur signup:', error);
    res.status(500).json({ 
      message: "Erreur lors de l'inscription", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Ne pas renvoyer le mot de passe
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };

    res.status(200).json({ 
      message: "Connexion réussie", 
      user: userWithoutPassword, 
      token 
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ 
      message: "Erreur lors de la connexion", 
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
    const newToken = jwt.sign(
      { id: decoded.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Erreur refresh token:', error);
    res.status(403).json({ message: "Token invalide ou expiré." });
  }
}; 