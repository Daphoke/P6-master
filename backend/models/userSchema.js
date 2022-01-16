///// import module /////
// Import module mongoose
const mongoose = require('mongoose');
///// import module / END /////

///// Import module de sécurité /////
// Import du module mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");
///// import module de sécurité / END /////

///// Évènement de connection Mongoose /////
// Connecté avec succès
mongoose.connection.on('connected', function () {  
    console.log('(user) Mongoose default connection opened');
}); 
  
// La connexion renvoie une erreur
mongoose.connection.on('error',function (err) {  
    console.log('(user) Mongoose default connection error: ' + err);
}); 
  
// Connexion interrompue
mongoose.connection.on('disconnected', function () {  
    console.log('(user) Mongoose default connection disconnected'); 
});
  
// Déconnection de MongoDB si le processus Node se termine
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('(user) Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
}); 
///// Évènements de connection Mongoose / END /////

///// Création du schéma utilisateur /////
const userSchema = mongoose.Schema({
    // Adresse e-mail de l'utilisateur
     email: {
        type: String,
        required: true,
        unique: true,
      },
    // Mot de passe "haché" de l'utilisateur
    // Utilisant mongoose-unique-validator, 2 comptes ne peuvent être créer avec le même e-mail
    password: {
        type: String,
        required: true,
    },
});
///// Création du schéma utilisateur / END /////

///// Application de mongoose-unique-validator au schéma utilisateur /////
userSchema.plugin(uniqueValidator);

///// Export du schéma en tant que modèle Mongoose "user", et mise à disposition pour l'application Express /////
module.exports = mongoose.model("User", userSchema);