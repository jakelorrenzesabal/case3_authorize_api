const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        // actionType: { type: DataTypes.STRING, allowNull: false }, // Must not be null
        // actionDetails: { type: DataTypes.TEXT, allowNull: true },
        // timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

        actionType: { type: DataTypes.STRING, allowNull: false },
        entity: { type: DataTypes.STRING, allowNull: true },
        entityId: { type: DataTypes.INTEGER, allowNull: true },
        actionDetails: { type: DataTypes.STRING, allowNull: true },
        timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        AccountId: { type: DataTypes.INTEGER, allowNull: false }
    };

    const options = {
        timestamps: false // No additional timestamps
    };

    return sequelize.define('ActivityLog', attributes, options);
}