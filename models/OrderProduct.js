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
        },
        allowNull: false
    },
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
},{})

module.exports = OrderProduct
