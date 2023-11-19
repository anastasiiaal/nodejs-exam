const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const User = require('./User')
const Tag = require('./Tag')
const Role = require('./Role')
const Order = require('./Order')
const OrderProduct = require('./OrderProduct')
const Cart = require('./Cart')
const ProductCart = require('./ProductCart')


// Déclaration des relations

// product can have many tags, a tag can define many product
Product.belongsToMany(Tag, { through: 'ProductTag' });
Tag.belongsToMany(Product, { through: 'ProductTag' });

// user can have only one role, a role can define many users
User.belongsTo(Role, { as: 'role', foreignKey: 'RoleId' });
Role.hasMany(User, { foreignKey: 'RoleId' });

// one user can have many orders, one order can only belong to one user
User.hasMany(Order);
Order.hasOne(User);

// cart can only belong to a single user, user can have many carts throughout the years of using this site
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

// one order can contain many products, one product can be a part of many orders
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

// one produc can be in many carts, a cart can contain many products
Product.belongsToMany(Cart, {through: ProductCart});
Cart.belongsToMany(Product, {through: ProductCart});

// Synchronisation de la base
// sequelize.sync({alter: true});

module.exports = {
    Product: Product,
    User: User,
    Tag: Tag,
    Role: Role,
    Order: Order,
    OrderProduct: OrderProduct,
    Cart: Cart,
    ProductCart: ProductCart
}
