const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
    }
}, {})

module.exports = Tag