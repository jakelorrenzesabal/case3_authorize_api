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

    // Initialize models and add them to the exported `db` object
    db.User = require('../users/user.model')(sequelize);
    db.Order = require('../orders/order.model')(sequelize);
    db.Preferences = require('../models/preferences.model')(sequelize);  
    db.Product = require('../products/product.model')(sequelize);
    db.Inventory = require('../inventories/inventory.model')(sequelize);
    db.Branch = require('../branches/branch.model')(sequelize);
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    db.ActivityLog = require('../models/activitylog.model')(sequelize);

    // Define associations
    db.Product.hasOne(db.Inventory, { as: 'inventory', foreignKey: 'productId' });
    db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });

    db.Branch.hasMany(db.Account, { onDelete: 'CASCADE' });
    db.Account.belongsTo(db.Branch);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });
    db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });
    
//=============================================================
    db.Booking = require('../booking/booking.model')(sequelize);
    db.Room = require('../rooms/room.model')(sequelize);
    db.Payment = require('../payment/payment.model')(sequelize);

    db.Warehouse = require('../models/warehouse.model')(sequelize);
    db.Store = require('../models/store.model')(sequelize);

        // db.User.hasMany(db.Booking, { foreignKey: 'userId' });
        // db.Booking.belongsTo(db.User, { foreignKey: 'userId' });
        // db.Room.hasMany(db.Booking, { foreignKey: 'roomId' });
        // db.Booking.belongsTo(db.Room, { foreignKey: 'roomId' });

        // db.Booking.hasOne(db.Payment, { foreignKey: 'bookingId' });
        // db.Payment.belongsTo(db.Booking, { foreignKey: 'bookingId' });


        // db.Warehouse.hasMany(db.Inventory, { foreignKey: 'warehouseId' });
        // db.Inventory.belongsTo(db.Warehouse);

        // db.Store.hasMany(db.Inventory, { foreignKey: 'storeId' });
        // db.Inventory.belongsTo(db.Store);

        defineAssociations();

        await sequelize.sync({ alter: true });
} 

function defineAssociations() {
    db.Warehouse.hasMany(db.Inventory, { foreignKey: 'warehouseId' });
    db.Inventory.belongsTo(db.Warehouse, { foreignKey: 'warehouseId' });

    db.Store.hasMany(db.Inventory, { foreignKey: 'storeId' });
    db.Inventory.belongsTo(db.Store, { foreignKey: 'storeId' });

    db.Product.hasOne(db.Inventory, { /* as: 'inventory', */ foreignKey: 'productId' });
    db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });

    db.Branch.hasMany(db.Account, { onDelete: 'CASCADE' });
    db.Account.belongsTo(db.Branch);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });
    db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });

    db.User.hasMany(db.Booking, { foreignKey: 'userId' });
    db.Booking.belongsTo(db.User, { foreignKey: 'userId' });
    db.Room.hasMany(db.Booking, { foreignKey: 'roomId' });
    db.Booking.belongsTo(db.Room, { foreignKey: 'roomId' });

    db.Booking.hasOne(db.Payment, { foreignKey: 'bookingId' });
    db.Payment.belongsTo(db.Booking, { foreignKey: 'bookingId' });
}