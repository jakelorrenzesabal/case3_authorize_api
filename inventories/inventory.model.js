const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },

        //added
        warehouseQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
        storeQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
        reorderLevel: { type: DataTypes.INTEGER, defaultValue: 10 }
    };

    return sequelize.define('Inventory', attributes);
};