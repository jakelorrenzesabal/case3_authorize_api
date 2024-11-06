const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        // orderProduct: { type: DataTypes.STRING, allowNull: false },
        // orderStatus: { 
        //     type: DataTypes.ENUM('pendding', 'processed', 'shipped', 'delivered', 'cancel'), 
        //     allowNull: false, 
        //     defaultValue: 'pendding'
        // },
        // shippingAddress: { type: DataTypes.STRING, allowNull: false },
        // totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
        orderProduct: { type: DataTypes.STRING, allowNull: false },
        orderStatus: { 
            type: DataTypes.ENUM('pending', 'processed', 'shipped', 'delivered', 'cancelled'), 
            allowNull: false, 
            defaultValue: 'pending'
        },
        shippingAddress: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

        // New fields
        salesChannel: { 
            type: DataTypes.ENUM('walk-in', 'online'), 
            allowNull: false, 
            defaultValue: 'online' 
        },
        paymentMethod: { 
            type: DataTypes.ENUM('cash', 'card', 'wallet'), 
            allowNull: false 
        },
        deliveryStatus: { 
            type: DataTypes.ENUM('dispatched', 'in-transit', 'delivered'), 
            allowNull: false, 
            defaultValue: 'dispatched' 
        }
    };

    const options = {
        timestamps: true 
    };


    return sequelize.define('Order', attributes, options);
}


