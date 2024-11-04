const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('ApiKey', {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        apiKey: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    });
};