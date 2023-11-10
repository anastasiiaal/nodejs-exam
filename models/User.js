const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const User = sequelize.define('User', {
    id_role: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    indexes: [
        {'unique': true, fields: ['email']},
    ]
})

module.exports = User