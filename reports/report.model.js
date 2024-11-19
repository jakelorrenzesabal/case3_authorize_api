const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        period: { type: DataTypes.ENUM('daily', 'weekly', 'monthly'), allowNull: false },
        startDate: { type: DataTypes.DATE, allowNull: false },
        endDate: { type: DataTypes.DATE, allowNull: false },
        totalOrders: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        completedDeliveries: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        inventoryAdjustments: { type: DataTypes.JSON, allowNull: true }, // Store adjustment details as JSON
        generatedBy: { type: DataTypes.INTEGER, allowNull: false }, // Reference to admin user ID
    };

    const options = {
        timestamps: true // Adds createdAt and updatedAt
    };

    return sequelize.define('Report', attributes, options);
}