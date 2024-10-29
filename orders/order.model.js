const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        orderStatus: { 
            type: DataTypes.ENUM('pendding', 'processed', 'shipped', 'delivered', 'cancel'), 
            allowNull: false, 
            defaultValue: 'pendding'
        },
        shippingAddress: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        //userId: { type: DataTypes.STRING, allowNull: false }

    };

    const options = {
        timestamps: true 
    };

    // Order.associate = (model) => {
    //     belongsTo(model.User, { foreignKey: 'userId', as: 'customer' });
    //     belongsToMany(model.Product, { through: 'OrderProducts', foreignKey: 'orderId' });
    // }

    return sequelize.define('Order', attributes, options);
}


