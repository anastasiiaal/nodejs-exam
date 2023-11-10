const sequelize = require('./_database');
const { DataTypes } = require('sequelize');
const Order = require('./Order')
const Product = require('./Product')

const OrderProduct = sequelize.define('OrderProduct', {
    OrderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
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

module.exports = OrderProduct
