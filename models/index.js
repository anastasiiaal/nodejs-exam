const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const User = require('./User')
const Tag = require('./Tag')
const Role = require('./Role')
const Order = require('./Order')
const OrderProduct = require('./OrderProduct')

// Déclaration des relations
Product.belongsToMany(Tag, { through: 'ProductTag' })
Tag.belongsToMany(Product, { through: 'ProductTag' })

// Role.hasMany(User)
// User.hasOne(Role)
User.belongsTo(Role, { as: 'role', foreignKey: 'RoleId' });
Role.hasMany(User, { foreignKey: 'RoleId' });

User.hasMany(Order)
Order.hasOne(User)
Order.belongsToMany(Product, { through: OrderProduct })
Product.belongsToMany(Order, { through: OrderProduct })

// Synchronisation de la base
// sequelize.sync({alter: true});

module.exports = {
    Product: Product,
    User: User,
    Tag: Tag,
    Role: Role,
    Order: Order,
    OrderProduct: OrderProduct
}
