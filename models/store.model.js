const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        timestamps: true 
    };

    return sequelize.define('Booking', attributes, options);
}