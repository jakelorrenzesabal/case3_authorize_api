const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        orderStatus: { 
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), 
            allowNull: false, 
            defaultValue: 'pending'
        },
        salesChannel: { 
            type: DataTypes.ENUM('walk-in', 'online'), 
            allowNull: false, 
            defaultValue: 'online' 
        },
        
        shippingAddress: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false  },
        quantity: { type: DataTypes.INTEGER,allowNull: false,defaultValue: 1, validate: { min: 1 }},
        payment: { type: DataTypes.ENUM('Cash','Card','digitalWallet'), allowNull: false, defaultValue: 'cash '}
    };

    const options = {
        timestamps: true 
    };


    return sequelize.define('Order', attributes, options);
}


