const user = require("../models/userSchema");

const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  ///  Appel de la fonction asynchrone de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois
  bcrypt.hash(req.body.password, 10)
  // Création d'un utilisateur et enregistrement dans la base de données. Renvoie une erreur ou une réponse de réussite
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé!'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({ error }));
};

// Se connecter à un compte utilisateur méthode permettant de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides. Implémentons donc notre fonction login
exports.login = (req, res, next) => {
 // Recherche de l'utilisateur dans la DB
 // utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données 
  User.findOne({ email: req.body.email })
    .then((user) => {

      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé!" })
      }
      // Compare the hashed tryed password to the hashed stored paswword
      // nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
      bcrypt.compare(req.body.password, user.password)
      .then((valid) => {
      // Return error if paswwords don't match
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect!" })
        }

        res.status(200).json({
          userId: user._id,
          token: jwt.sign ({userId: user._id},'RANDOM_TOKEN_SECRET',{expiresIn:"24h"})
        })

      })
      .catch(error => res.status(500).json({ error }))

    })
    .catch((error) => res.status(500).json({ error }))
};

