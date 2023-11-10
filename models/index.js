const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const User = require('./User')
const Tag = require('./Tag')
const Role = require('./Role')

// Déclaration des relations
Product.belongsToMany(Tag, {through: 'ProductTag'})
Tag.belongsToMany(Product, {through: 'ProductTag'})
User.hasOne(Role)
Role.hasMany(User)

// Synchronisation de la base
// sequelize.sync({alter: true});


module.exports = {
    Product: Product,
    User: User,
    Tag: Tag,
    Role: Role
}
