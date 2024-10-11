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

        db.User = require('../users/user.model')(sequelize);
        db.Account = require('../accounts/account.model')(sequelize);
        db.ActivityLog = require('../models/activitylog.model')(sequelize);
        db.Order = require('../orders/order.model')(sequelize);

        db.Preferences = require('../models/preferences.model')(sequelize);
        //db.User.hasMany(db.Preferences, { foreignKey: 'userId' });  // Branch has many Users
        db.Preferences.belongsTo(db.User, { foreignKey: 'userId' });

        db.Product = require('../products/product.model')(sequelize);
        db.Inventory = require('../inventories/inventory.model')(sequelize);
        db.Product.hasOne(db.Inventory, { foreignKey: 'productId', as: 'inventory', onDelete: 'CASCADE' });
        db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });

        db.Branch = require('../branches/branch.model')(sequelize);   
        db.Branch.hasMany(db.User, { foreignKey: 'branchId', as: 'users' });  // Branch has many Users
        db.User.belongsTo(db.Branch, { foreignKey: 'branchId', as: 'branch' });

        await sequelize.sync({ alter: true });
    } 