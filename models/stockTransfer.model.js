const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        productId: { type: DataTypes.INTEGER, allowNull: false },
        fromWarehouseId: { type: DataTypes.INTEGER, allowNull: false },
        toStoreId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' }
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('SttockTransfer', attributes, options);
}