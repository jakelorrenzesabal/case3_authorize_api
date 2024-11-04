const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        orderProduct: { type: DataTypes.STRING, allowNull: false },
        orderStatus: { 
            type: DataTypes.ENUM('pendding', 'processed', 'shipped', 'delivered', 'cancel'), 
            allowNull: false, 
            defaultValue: 'pendding'
        },
        shippingAddress: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    };

    const options = {
        timestamps: true 
    };


    return sequelize.define('Order', attributes, options);
}


