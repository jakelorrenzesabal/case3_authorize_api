const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        userId: { type: DataTypes.INTEGER, allowNull: false },
        roomId: { type: DataTypes.INTEGER, allowNull: false },
        checkInDate: { type: DataTypes.DATE, allowNull: false },
        checkOutDate: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.ENUM('confirmed', 'pending', 'canceled'), defaultValue: 'pending' }
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('Booking', attributes, options);
}