// Import fichier P6-master/backend/models/userSchema
const User = require("../models/userSchema");

///// Import module de sécurité /////
// import module bcrypt (fonction de hachage)
const bcrypt = require("bcrypt");
// import module jsonwebtoken (permet l'échange sécurisé de jetons)
const jwt = require("jsonwebtoken");
///// Import module de sécurité / END /////

///// Signup / Implémentation logique métier route POST/////
// Création d'un compte utilisateur, implémentation de notre fonction signup
exports.signup = (req, res, next) => {
  ///  Appel de la fonction asynchrone de hachage de bcrypt dans notre mot + salage x 10
  bcrypt.hash(req.body.password, 10)
  // Création d'un utilisateur
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // Enregistrement de l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé!'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({ error }));
};
///// Signup / END /////

///// Login / Implémentation logique métier route POST /////
/// Se connecter à un compte utilisateur, implémentation de notre fonction login
exports.login = (req, res, next) => {
  // identification de l'utilisateur
  User.findOne({ email: req.body.email })
  // Recherche de l'utilisateur
  .then((user) => {
      // Utilisateur non trouvé
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé!" })
      }
      // Compare le mot de passe haché testé au mot de pas haché enregistré avec bcrypt
      bcrypt.compare(req.body.password, user.password)
      
      .then((valid) => {
        // Retourne une erreur si le mot de passe ne match pas
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect!" })
        }
        res.status(200).json({
          userId: user._id,
          // Création d'un token de sécurisation du compte utilisateur
          token: jwt.sign ({userId: user._id},'RANDOM_TOKEN_SECRET',{expiresIn:"24h"})
        })
      })
      .catch(error => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
};
///// Login / END /////
