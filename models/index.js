const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');

// Déclaration des relations
// ...

// Synchronisation de la base
sequelize.sync({alter: true});


module.exports = {
    Product: Product,
}
