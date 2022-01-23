const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Créations de la constante storage, à passer à multer comme configuration
// Contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers
const storage = multer.diskStorage({
  //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images 
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Fonction filename, indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now()
  // Ex: (nom_fichier_1642340266509)
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.split('.'+ extension).join('_');
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export de l'élément multer entièrement configuré
// La methode single() Renvoie le middleware qui traite un seul fichier associé au champ de formulaire donné. 
// L'objet Request sera rempli avec un objet file contenant des informations sur le fichier traité.
module.exports = multer({storage: storage}).single('image');