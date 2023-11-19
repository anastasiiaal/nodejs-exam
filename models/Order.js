const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_price: {
        type: DataTypes.FLOAT
    },
    order_status: {
        type: DataTypes.STRING,
        defaultValue: "Processing"
    }
},{})

module.exports = Order