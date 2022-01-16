// Import fichier P6-master/backend/models/sauceSchema
const Sauce = require("../models/sauceSchema");

// import module file system (accès aux fonctions de modification du système de fichiers)
const fs = require('fs');

// Regular expression, Matches any character other than newline
const regex = /.+/;

///// AFFICHER TOUTES LES SAUCES /////
/// implémentation logique route GET, renvoie toutes les sauces dans la base de données : Méthode find ()
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
///// AFFICHER TOUTES LES SAUCES / END /////

///// AFFICHER UNE SEULE SAUCE /////
/// implémentation logique route GET, renvoie une sauces dans la base de données : Méthode findOne ()
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
///// AFFICHER UNE SEULE SAUCE / END /////

///// CRÉER UNE SAUCE /////
exports.createSauce = (req, res, next) => {
  if (
    !regex.test(newSauce.name) ||
    !regex.test(newSauce.manufacturer) ||
    !regex.test(newSauce.description) ||
    !regex.test(newSauce.mainPepper) ||
    !regex.test(newSauce.heat)
  ) {
    return res.status(500).json({ error: "Nom de sauce invalide!" });
  }

  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce modifié!'}))
    .catch(error => res.status(400).json({ error }));
};
///// CRÉER UNE SAUCE / END /////

///// MODIFIER UNE SAUCE /////
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ?
   {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : { ...req.body };

  Sauces.updateOne({ _id: req.params.id }, sauce)
    .then(() => res.status(201).json({ message: 'Sauce modifié!'}))
    .catch(error => res.status(400).json({ error }));
};
///// MODIFIER UNE SAUCE / END /////

///// SUPPRIMER UNE SAUCE /////
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé!'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
///// SUPPRIMER UNE SAUCE / END /////

// /**
//  * LIKE / DISLIKE UNE SAUCE
//  */
// exports.likeSauce = (req, res, next) => {
//     const userId = req.body.userId;
//     const like = req.body.like;
//     const sauceId = req.params.id;
//     Sauce.findOne({ _id: sauceId })
//         .then(sauce => {
//             // nouvelles valeurs à modifier
//             const newValues = {
//                 usersLiked: sauce.usersLiked,
//                 usersDisliked: sauce.usersDisliked,
//                 likes: 0,
//                 dislikes: 0
//             }
//             // Différents cas:
//             switch (like) {
//                 case 1:  // CAS: sauce liked
//                     newValues.usersLiked.push(userId);
//                     break;
//                 case -1:  // CAS: sauce disliked
//                     newValues.usersDisliked.push(userId);
//                     break;
//                 case 0:  // CAS: Annulation du like/dislike
//                     if (newValues.usersLiked.includes(userId)) {
//                         // si on annule le like
//                         const index = newValues.usersLiked.indexOf(userId);
//                         newValues.usersLiked.splice(index, 1);
//                     } else {
//                         // si on annule le dislike
//                         const index = newValues.usersDisliked.indexOf(userId);
//                         newValues.usersDisliked.splice(index, 1);
//                     }
//                     break;
//             };
//             // Calcul du nombre de likes / dislikes
//             newValues.likes = newValues.usersLiked.length;
//             newValues.dislikes = newValues.usersDisliked.length;
//             // Mise à jour de la sauce avec les nouvelles valeurs
//             Sauce.updateOne({ _id: sauceId }, newValues )
//                 .then(() => res.status(200).json({ message: 'Sauce notée !' }))
//                 .catch(error => res.status(400).json({ error }))
//         })
//         .catch(error => res.status(500).json({ error }));
// }
