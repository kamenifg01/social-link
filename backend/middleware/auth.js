const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Liste des routes publiques qui ne nécessitent pas d'authentification
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/signup',
      '/auth/forgot-password',
      '/auth/reset-password'
    ];

    // Normalisation du chemin de la requête pour ignorer les barres obliques finales
    const normalizedPath = req.path.replace(/\/$/, '');
    console.log('Chemin normalisé:', normalizedPath);

    // Vérifier si c'est une route publique
    const isPublicRoute = publicRoutes.some(route => normalizedPath.endsWith(route));
    if (isPublicRoute) {
      return next();
    }

    // Vérification du header d'autorisation
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Pas de header d\'autorisation ou format invalide');
      return res.status(401).json({ 
        success: false,
        message: 'Authentification requise' 
      });
    }

    // Extraction et vérification du token
    const token = authHeader.split(' ')[1];
    console.log('Token reçu:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', { userId: decoded.id });

    // Récupération de l'utilisateur
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('Utilisateur non trouvé pour l\'ID:', decoded.id);
      return res.status(401).json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      });
    }

    // Vérification du statut de l'utilisateur
    if (user.status !== 'active') {
      console.log('Compte utilisateur non actif:', user.status);
      return res.status(403).json({
        success: false,
        message: 'Compte utilisateur non actif'
      });
    }

    // Ajout de l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification détaillée:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    res.status(401).json({ 
      success: false,
      message: 'Erreur d\'authentification' 
    });
  }
}; 