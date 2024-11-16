const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        paymentMethod: { 
            type: DataTypes.ENUM('cash', 'card', 'digital_wallet'), 
            allowNull: false 
        },
        paymentStatus: { 
            type: DataTypes.ENUM('pending', 'completed', 'failed'), 
            allowNull: false, 
            defaultValue: 'pending' 
        }
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('Payment', attributes, options);
}