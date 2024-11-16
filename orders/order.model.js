const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        orderStatus: { 
            type: DataTypes.ENUM('pending', 'processed', 'shipped', 'delivered', 'cancelled'), 
            allowNull: false, 
            defaultValue: 'pending'
        },
        shippingAddress: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        salesChannel: { 
            type: DataTypes.ENUM('walk-in', 'online'), 
            allowNull: false, 
            defaultValue: 'online' 
        },
        paymentMethod: { 
            type: DataTypes.ENUM('cash', 'card', 'wallet', 'cod'), 
            allowNull: false,
            defaultValue: 'cod'
        },
        deliveryStatus: { 
            type: DataTypes.ENUM('dispatched', 'in-transit', 'delivered'), 
            allowNull: false, 
            defaultValue: 'dispatched' 
        },
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('Order', attributes, options);
}