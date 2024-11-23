const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        branchStatus: { type: DataTypes.ENUM('active', 'deactivated'), allowNull: false, defaultValue: 'active'},
        type: { type: DataTypes.ENUM('warehouse', 'store'), allowNull: false, defaultValue: 'store' }
    };
    const options = {
        defaultScope: {},
        scopes: {
            warehouses: {
                where: { type: 'warehouse' }
            },
            stores: {
                where: { type: 'store' }
            },
        }
    };

    return sequelize.define('Branch', attributes, options);
}


