const { Skill, SkillEndorsement, User, sequelize } = require('../models');

exports.addSkill = async (req, res) => {
  try {
    const { name } = req.body;
    const skill = await Skill.create({
      userId: req.user.id,
      name
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la compétence:', error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la compétence" });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findOne({
      where: { id, userId: req.user.id }
    });

    if (!skill) {
      return res.status(404).json({ message: "Compétence non trouvée" });
    }

    await skill.destroy();
    res.json({ message: "Compétence supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    res.status(500).json({ message: "Erreur lors de la suppression de la compétence" });
  }
};

exports.getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await Skill.findAll({
      where: { userId },
      include: [{
        model: SkillEndorsement,
        as: 'endorsements',
        include: [{
          model: User,
          as: 'endorser',
          attributes: ['id', 'username', 'profilePicture', 'title']
        }]
      }],
      order: [['endorsementsCount', 'DESC']]
    });

    res.json(skills);
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des compétences" });
  }
};

exports.endorseSkill = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { skillId } = req.params;
    const endorserId = req.user.id;

    const skill = await Skill.findByPk(skillId);
    if (!skill) {
      await t.rollback();
      return res.status(404).json({ message: "Compétence non trouvée" });
    }

    if (skill.userId === endorserId) {
      await t.rollback();
      return res.status(400).json({ message: "Vous ne pouvez pas valider vos propres compétences" });
    }

    const [endorsement, created] = await SkillEndorsement.findOrCreate({
      where: {
        skillId,
        endorserId
      },
      transaction: t
    });

    if (created) {
      await skill.increment('endorsementsCount', { transaction: t });
    }

    await t.commit();

    res.json({
      message: created ? "Compétence validée avec succès" : "Vous avez déjà validé cette compétence"
    });
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la validation de la compétence:', error);
    res.status(500).json({ message: "Erreur lors de la validation de la compétence" });
  }
};

exports.removeEndorsement = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { skillId } = req.params;
    const endorserId = req.user.id;

    const endorsement = await SkillEndorsement.findOne({
      where: {
        skillId,
        endorserId
      }
    });

    if (!endorsement) {
      await t.rollback();
      return res.status(404).json({ message: "Validation non trouvée" });
    }

    await endorsement.destroy({ transaction: t });
    
    const skill = await Skill.findByPk(skillId);
    await skill.decrement('endorsementsCount', { transaction: t });

    await t.commit();

    res.json({ message: "Validation retirée avec succès" });
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors du retrait de la validation:', error);
    res.status(500).json({ message: "Erreur lors du retrait de la validation" });
  }
}; 