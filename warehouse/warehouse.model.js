const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        bulkQuantity: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        minimumBulkLevel: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
        lastRestockDate: { type: DataTypes.DATE, allowNull: true },
        location: { type: DataTypes.STRING, allowNull: false, defaultValue: 'MAIN' },
        status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
    };

    const Warehouse = sequelize.define('Warehouse', attributes);

    return Warehouse;
};