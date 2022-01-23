//JWT permet de crypter les tokens d'authentification envoyés au client pour authentifier leur session, selon une clé prédéfinie
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Gestion des erreurs
  try {
    // Extraction du token du header Authorization dans la requête entrante, contient le mot-clé "Bearer"
    // .split([separator[, limit]])
    const token = req.headers.authorization.split(' ')[1];
    // Décodage du token secret défini au hasard
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // Extrait de l'ID utilisateur  
    const userId = decodedToken.userId;
    // si la requête contient un ID utilisateur, nous le comparons à celui extrait du token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};