const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        branchId: { type: DataTypes.INTEGER, allowNull: false },
    };

    const options = {
        indexes: [
            {
                unique: true,
                fields: ['productId', 'branchId'],
            },
        ],
    };

    return sequelize.define('Inventory', attributes);
};