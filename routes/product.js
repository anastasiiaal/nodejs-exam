const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product } = require('../models');

router.get('/', function(req, res){
    res.send('Liste des produits');
});

module.exports = router;