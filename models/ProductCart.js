const sequelize = require('./_database');
const { DataTypes } = require('sequelize');
const Cart = require('./Cart')
const Product = require('./Product')

const ProductCart = sequelize.define('ProductCart', {
    CartId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER
    }
},{})

module.exports = ProductCart