const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        bookingId: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('completed', 'pending', 'failed'), defaultValue: 'pending' },
        paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('Payment', attributes, options);
}