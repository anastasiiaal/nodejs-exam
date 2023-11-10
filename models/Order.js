const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
    address: {
        type: DataTypes.STRING
    }
},{})

module.exports = Order