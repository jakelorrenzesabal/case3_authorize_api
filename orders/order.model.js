const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        orderStatus: { 
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), 
            allowNull: false, 
            defaultValue: 'pending'
        },
        shippingAddress: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.FLOAT, allowNull: false  }
    };

    const options = {
        timestamps: true 
    };


    return sequelize.define('Order', attributes, options);
}


