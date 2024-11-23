const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.FLOAT, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        productStatus: { type: DataTypes.ENUM('deactivated', 'active'), allowNull: false, defaultValue: 'active'},
        SKU: { type: DataTypes.STRING, allowNull: true, UNIQUE: true }
    };
    const options = {
        timestamps: true 
    };
    
    return sequelize.define('Product', attributes, options);
};