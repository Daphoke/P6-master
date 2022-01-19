// Import fichier P6-master/backend/models/sauceSchema
const Sauce = require("../models/sauceSchema");

// import module file system (accès aux fonctions de modification du système de fichiers)
const fs = require("fs");

///// Afficher toutes les sauces / Implémentation logique métier route GET /////
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
///// Afficher toutes les sauces / END /////

///// Afficher une sauce / Implémentation logique métier route GET /////
exports.getOneSauce = (req, res, next) => {
  // Sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
///// Afficher une sauce / END /////

///// Créer une sauce / Implémentation logique métier route POST /////
exports.createSauce = (req, res, next) => {
  // Analyse à l'aide de JSON.parse() pour obtenir un objet utilisable
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // Création d'un nouvel objet Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // Création de l'URL de l'image: http://localhost:3000/images/filename
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    // Enregistrement de la sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce modifié!" }))
    .catch((error) => res.status(400).json({ error }));
};
///// Créer une sauce / END /////

///// Modifier une sauce / Implémentation logique métier route PUT /////
exports.updateSauce = (req, res, next) => {
  //// Si rec.file existe ? ({oui}:{non})
  const sauceObject = req.file
    ? /// Si rec.file existe
      {
        // Analyse à l'aide de JSON.parse() pour obtenir un objet utilisable
        ...JSON.parse(req.body.sauce),
        // Création de l'URL de l'image: http://localhost:3000/images/filename
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : /// Si rec.file existe pas / modification sans nouvelle image
      { ...req.body };
  /// Mise à jour de la sauce _id qui correspond à l'objet que nous passons comme premier argument
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(201).json({ message: "Sauce modifié!" }))
    .catch((error) => res.status(400).json({ error }));
};
///// Modifier une sauce / END /////

///// Suprimer une sauce / Implémentation logique métier route DELETE /////
exports.deleteSauce = (req, res, next) => {
  // Localisation de la suppression
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      // Suppression du fichier images/${filename}
      fs.unlink(`images/${filename}`, () => {
        // Suppression de l'objet sauce
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
///// Suprimer une sauce / END /////

///// Like / Implémentation logique métier route POST /////
exports.likeSauce = (req, res, next) => {
  //Déclaration userId, sauceId
  let userId = req.body.userId
  let sauceId = req.params.id

  // Thumb up, On incrémente likes de 1 et on push "usersLiked"
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
      }
    )
      .then((sauce) => res.status(200).json({message: "Like ajouté!"}))
      .catch((error) => res.status(400).json({ error }));
  // Thumb down, On incrémente dislikes de 1 et on push "usersDisliked"    
  }
  if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId },
      }
    )
      .then((sauce) => res.status(200).json({message: "Dislike ajouté!"}))
      .catch((error) => res.status(400).json({ error }));
  }
  // Si req.body.like === 0 l'utilisateur annule son vote 
  if (req.body.like === 0) {
    // Localisation de l'annulation
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        // Si l'utilisateur a liké la sauce, On incrémente likes de -1 et on retire l'utilisateur du tableau "usersLiked" 
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, 
              $inc: { likes: -1 }
            }
          )
            .then((sauce) => {res.status(200).json({ message:"Like supprimé!"})})
            .catch((error) => res.status(400).json({ error }));
      }
        // Si l'utilisateur disliké la sauce, On incrémente dislikes de -1 et on retire l'utilisateur du tableau "usersDisliked" 
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {res.status(200).json({ message: "Dislike supprimé!" })})
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(400).json({ error }))
  }
};
///// Like / END /////
