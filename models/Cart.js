const sequelize = require('./_database');
const { DataTypes } = require('sequelize');
const User = require('./User')

const Cart = sequelize.define('Cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
},{})

module.exports = Cart