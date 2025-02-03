const { User } = require('../models');
const userService = require('../services/userService');

exports.signup = async (req, res) => {
  try {
    const user = await userService.signup(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'username', 'email', 'title', 'company', 'location', 'bio']
    });

    if (!user) {
      // Créer un profil par défaut si l'utilisateur n'existe pas
      user = await User.create({
        id: userId,
        username: 'Utilisateur',
        email: req.user.email,
        title: '',
        company: '',
        location: '',
        bio: ''
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, title, company, location, bio } = req.body;

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      // Créer l'utilisateur s'il n'existe pas
      user = await User.create({
        id: userId,
        username,
        email: req.user.email,
        title,
        company,
        location,
        bio
      });
    } else {
      // Mettre à jour l'utilisateur existant
      await user.update({
        username,
        title,
        company,
        location,
        bio
      });
    }

    res.json({
      message: "Profil mis à jour avec succès",
      user: {
        id: user.id,
        username,
        title,
        company,
        location,
        bio
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.destroy();
    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}; 