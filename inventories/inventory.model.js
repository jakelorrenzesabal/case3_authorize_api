const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        locationType: { 
            type: DataTypes.ENUM('warehouse', 'store1', 'store2'), 
            allowNull: false, 
            defaultValue: 'warehouse' 
        },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 }
    };

    return sequelize.define('Inventory', attributes);
};