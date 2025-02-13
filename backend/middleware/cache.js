const cacheControl = (req, res, next) => {
  // Désactiver la mise en cache pour les réponses dynamiques
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

module.exports = cacheControl; 