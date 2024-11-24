const db = require('_helpers/db');
const { Op, Sequelize } = require('sequelize');

module.exports = {
    getWarehouseStock,
    updateBulkStock,
    transferToStore,
    checkWarehouseLevels,
    setMinimumBulkLevel,
    getLowBulkStock
};

async function getWarehouseStock() {
    return await db.Warehouse.findAll({
        include: [{
            model: db.Product,
            where: { productStatus: 'active' }
        }]
    });
}

async function updateBulkStock(productId, quantity) {
    const warehouse = await db.Warehouse.findOne({
        where: { 
            productId,
            status: 'active'
        }
    });

    if (!warehouse) {
        throw new Error('Warehouse stock not found for this product');
    }

    warehouse.bulkQuantity = quantity;
    warehouse.lastRestockDate = new Date();
    await warehouse.save();
    
    return warehouse;
}

async function transferToStore(productId, transferQuantity) {
    const warehouse = await db.Warehouse.findOne({
        where: { 
            productId,
            status: 'active'
        }
    });

    if (!warehouse) {
        throw new Error('Warehouse stock not found for this product');
    }

    if (warehouse.bulkQuantity < transferQuantity) {
        throw new Error('Insufficient warehouse stock for transfer');
    }

    // Start transaction

    try {
        // Reduce warehouse stock
        warehouse.bulkQuantity -= transferQuantity;
        await warehouse.save();

        // Increase store inventory
        const inventory = await db.Inventory.findOne({
            where: { productId },
        });

        if (!inventory) {
            throw new Error('Store inventory not found');
        }

        inventory.quantity += transferQuantity;
        await inventory.save();

        // Commit transaction

        return {
            warehouseQuantity: warehouse.bulkQuantity,
            storeQuantity: inventory.quantity
        };
    } catch (error) {
        throw error;
    }
}

async function checkWarehouseLevels(productId) {
    const warehouse = await db.Warehouse.findOne({
        where: { 
            productId,
            status: 'active'
        },
        include: [{
            model: db.Product,
            attributes: ['name', 'productStatus']
        }]
    });

    if (!warehouse) {
        return null;
    }

    return {
        productName: warehouse.Product.name,
        bulkQuantity: warehouse.bulkQuantity,
        minimumBulkLevel: warehouse.minimumBulkLevel,
        location: warehouse.location,
        lastRestockDate: warehouse.lastRestockDate
    };
}

async function setMinimumBulkLevel(productId, minimumLevel) {
    const warehouse = await db.Warehouse.findOne({
        where: { 
            productId,
            status: 'active'
        }
    });

    if (!warehouse) {
        throw new Error('Warehouse stock not found for this product');
    }

    warehouse.minimumBulkLevel = minimumLevel;
    return await warehouse.save();
}

async function getLowBulkStock() {
    return await db.Warehouse.findAll({
        where: {
            bulkQuantity: {
                [Op.lte]: Sequelize.col('minimumBulkLevel')
            },
            status: 'active'
        },
        include: [{
            model: db.Product,
            where: { productStatus: 'active' }
        }]
    });
}