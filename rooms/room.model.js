const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        roomNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
        roomType: { type: DataTypes.STRING, allowNull: false },
        capacity: { type: DataTypes.INTEGER, allowNull: false },
        pricePerNight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('available', 'booked'), defaultValue: 'available' }
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('Room', attributes, options);
}