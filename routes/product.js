const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product, Tag } = require('../models');

router.get('/', function (req, res) {
    res.send('Liste des produits');
});

// route to get all products to show them in catalog (with pagination)
router.get('/all', async function (req, res) {
    // here we manage pagination: 
    // 1. we get "page" key from query or set to 1 if not provided
    // 2. we choose quantity per page
    // 3. we count the offset to use in query
    const page = req.query.page || 1;
    const productsPerPage = 3;
    const offset = (page - 1) * productsPerPage;

    const products = await Product.findAll({
        attributes: ['id', 'title', 'price'],
        include: [{
            model: Tag,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }],
        offset: offset,
        limit: productsPerPage,
    })

    if (products) {
        try {
            res.status(200)
            res.json(products)
        } catch(exception) {
            res.status(500)
            res.json("Error while etching :" + exception)
        }
    } else {
        res.status(404)
        res.json({ message: "Products not found"})
    }
    
});

module.exports = router;
