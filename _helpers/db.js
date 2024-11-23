    const config = require('config.json');
    const mysql = require('mysql2/promise');
    const { Sequelize } = require('sequelize');

    module.exports = db = {};

    initialize();
    async function initialize() { 
        const { host, port, user, password, database } = config.database;
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        await connection.end();

        const sequelize = new Sequelize(database, user, password, { host: 'localhost', dialect: 'mysql' });

    //db.User = require('../users/user.model')(sequelize);
    db.Order = require('../orders/order.model')(sequelize);
    db.Preferences = require('../models/preferences.model')(sequelize);  
    db.Product = require('../products/product.model')(sequelize);
    db.Inventory = require('../inventories/inventory.model')(sequelize);
    db.Branch = require('../branches/branch.model')(sequelize);
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    db.ActivityLog = require('../models/activitylog.model')(sequelize);
    db.Payment = require('../payment/payment.model')(sequelize);
    //db.Warehouse = require('../models/warehouse.model')(sequelize);
    db.Report = require('../reports/report.model')(sequelize);
    //db.Transfer = require('../transfers/transfer.model')(sequelize);

        defineAssociations();

        await sequelize.sync({ alter: true });
} 

function defineAssociations() {

    db.Branch.hasMany(db.Account, { onDelete: 'CASCADE' });
    db.Account.belongsTo(db.Branch);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });
    db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });

    // db.Product.hasOne(db.Inventory, { foreignKey: 'productId' });
    // db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });

    db.Branch.hasMany(db.Account, { onDelete: 'CASCADE' });
    db.Account.belongsTo(db.Branch);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });
    db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });

    // db.Customer.hasMany(db.Order, { foreignKey: 'customerId' });
    // db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });

    // db.Transfer.hasOne(db.Inventory, { foreignKey: 'transferId' });
    // db.Inventory.belongsTo(db.Transfer, { foreignKey: 'transferId' });

    // db.Transfer.belongsTo(db.Product, { foreignKey: 'productId' });
    // db.Transfer.belongsTo(db.Account, { foreignKey: 'accountId' });

    db.Product.hasMany(db.Order, { foreignKey: 'productId' });
    db.Order.belongsTo(db.Product, { foreignKey: 'productId' });

    // db.Customer.hasMany(db.Order, { foreignKey: 'customerId', onDelete: 'CASCADE' });
    // db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });
    db.Order.hasOne(db.Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
    db.Payment.belongsTo(db.Order, { foreignKey: 'orderId' });

    db.Product.hasMany(db.Inventory, { foreignKey: 'productId'/* , onDelete: 'CASCADE' */ });
    db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });

    db.Branch.hasMany(db.Inventory, { foreignKey: 'branchId'/* , onDelete: 'CASCADE' */ });
    db.Inventory.belongsTo(db.Branch, { foreignKey: 'branchId' });
    
    // db.Product.hasMany(db.Branch, { foreignKey: 'productId' });
    // db.Branch.belongsTo(db.Product, { foreignKey: 'productId' });
    // db.Branch.hasMany(db.Product, { foreignKey: 'branchId' });
    // db.Product.belongsTo(db.Branch, { foreignKey: 'branchId' });

    db.Account.hasMany(db.Order, { foreignKey: 'customerId' });
    db.Order.belongsTo(db.Account, { foreignKey: 'customerId' });

    // db.Product.hasMany(db.Branch, { foreignKey: 'productId' });
    // db.Branch.belongsTo(db.Product, { foreignKey: 'productId' });

    db.Product.hasMany(db.Inventory, { foreignKey: 'productId' });
    db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });

    // A Warehouse can have many Inventory records (one-to-many)
    // db.Warehouse.hasMany(db.Inventory, { foreignKey: 'warehouseId' });
    // db.Inventory.belongsTo(db.Warehouse, { foreignKey: 'warehouseId' });

}