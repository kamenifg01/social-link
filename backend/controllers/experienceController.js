const { Experience } = require('../models');

exports.addExperience = async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, current, description } = req.body;
    const experience = await Experience.create({
      userId: req.user.id,
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'expérience:', error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'expérience" });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, startDate, endDate, current, description } = req.body;
    
    const experience = await Experience.findOne({
      where: { id, userId: req.user.id }
    });

    if (!experience) {
      return res.status(404).json({ message: "Expérience non trouvée" });
    }

    await experience.update({
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description
    });

    res.json(experience);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'expérience:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'expérience" });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findOne({
      where: { id, userId: req.user.id }
    });

    if (!experience) {
      return res.status(404).json({ message: "Expérience non trouvée" });
    }

    await experience.destroy();
    res.json({ message: "Expérience supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'expérience:', error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'expérience" });
  }
};

exports.getUserExperiences = async (req, res) => {
  try {
    const { userId } = req.params;
    const experiences = await Experience.findAll({
      where: { userId },
      order: [['startDate', 'DESC']]
    });

    res.json(experiences);
  } catch (error) {
    console.error('Erreur lors de la récupération des expériences:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des expériences" });
  }
}; 