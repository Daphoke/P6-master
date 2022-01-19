///// import module /////
// Import module mongoose
const mongoose = require('mongoose');
///// import module / END /////

///// Évènements de connection Mongoose /////
// Connecté avec succès
mongoose.connection.on('connected', function () {  
    console.log('(sauce) Mongoose default connection opened')
}); 
  
// La connexion renvoie une erreur
mongoose.connection.on('error',function (err) {  
    console.log('(sauce) Mongoose default connection error: ' + err);
});
  
// Connexion interrompue
mongoose.connection.on('disconnected', function () {  
    console.log('(user) Mongoose default connection disconnected'); 
});
///// Évènements de connection Mongoose / END /////

///// Création du schéma sauce /////
const sauceSchema = mongoose.Schema({
    // L'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    userId: { type: String, required: true },
    // Nom de la sauce
    name: { type: String, required: true },
    // Fabricant de la sauce
    manufacturer: { type: String, required: true },
    // Description de la sauce
    description: { type: String, required: true },
    // Le principal ingrédient épicé de la sauce
    mainPepper: { type: String, required: true },
    // L'URL de l'image de la sauce uploadé par l'utilisateur
    imageUrl: { type: String, required: true },
    // Nombre entre 1 et 10 décrivant la sauce
    heat: { type: Number, required: true, min: 1, max: 10,},
    // Nombre d'utilisateurs qui aiment la sauce
    likes: { type: Number, required: true,  default: 0},
    // Nombre d'utilisateurs qui n'aiment pas la sauce
    dislikes: { type: Number, required: true, default: 0},
    // [ "String <userId>" ] — tableau des identifiants des utilisateurs
    usersLiked: { type: [String], required: true, default: []},
    // [ "String <userId>" ] — tableau des identifiants des utilisateurs qui n'ont pas aimé
    usersDisliked: { type: [String], required: true, default: []},
});
///// Création du schéma sauce / END /////

///// Export du schéma en tant que modèle Mongoose "sauce", et mise à disposition pour l'application Express /////
module.exports = mongoose.model('Sauce', sauceSchema)