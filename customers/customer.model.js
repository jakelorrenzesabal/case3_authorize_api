// const { DataTypes } = require('sequelize');

// module.exports = model;

// function model(sequelize) {
//     const attributes = { 
//         firstName: { type: DataTypes.STRING, allowNull: false },
//         lastName: { type: DataTypes.STRING, allowNull: false },
//         email: { type: DataTypes.STRING, allowNull: false, unique: true },
//         phoneNumber: { type: DataTypes.STRING },
//         loyaltyPoints: { type: DataTypes.INTEGER, defaultValue: 0 }
//     };

//     const options = {
//         timestamps: true 
//     };

//     return sequelize.define('Customer', attributes, options);
// }