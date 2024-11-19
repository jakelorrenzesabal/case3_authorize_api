const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 }
    };

    return sequelize.define('Inventory', attributes);
};