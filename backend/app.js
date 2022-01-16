///// Import modules /////
/// Express
const express = require('express');
/// Mongoose
const mongoose = require('mongoose');
/// Body-parser
const bodyParser = require('body-parser');
/// path
const path = require("path");
///// import modules / END /////

///// Import Routers /////
const userRoutes = require('./routes/userRoutes')
const sauceRoutes = require('./routes/sauceRoutes');

///// Création application express /////
const app = express();

///// MongoDB Atlas connection string to Cluster /////
mongoose.connect(
    "mongodb+srv://admin:admin@cluster.nxly1.mongodb.net/Cluster?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie!"))
  .catch(() => console.log("Connexion à MongoDB échouée!"));
///// MongoDB Atlas connection string to Cluster / END /////

///// Cross Origin Resource Sharing setting /////
// Configurer les bons headers sur l'objet réponse permet l'envoi et la réception de requêtes et de réponses sans erreurs CORS.
app.use((req, res, next) => {
  // Accès à l'API depuis n'importe quelle origine "*"
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ajout en-têtes d'autorisation de contrôle d'accès aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // ajout méthodes d'autorisation de contrôle d'accès aux requêtes envoyées vers notre API  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
///// Cross Origin Resource Sharing setting / END /////

///// Mise à disposition des "body" sur l'objet req pour toutes les requêtes qui ont comme Content-Type "application/json" /////
app.use(express.json());

// Accès à "/images"
app.use('/images', express.static(path.join(__dirname, 'images')))

///// Eléments de middleware /////
// http://localhost:3000/api/sauces ??
app.use('/api/sauces', sauceRoutes);
// http://localhost:3000/api/auth ??
app.use('/api/auth', userRoutes);
///// Eléments de middleware / END /////

///// Export constante app (application) /////
module.exports = app;