const db = require('_helpers/db');

module.exports = {
    getInventory,
    updateStockLevels,
    checkAvailability,
    getWarehouseInventory,
    getStoreInventory,
    checkStockLevels,
    transferProduct
};

async function getInventory() {
    return await db.Inventory.findAll({ 
        //include: db.Product 
    });
}
async function updateStockLevels(productId, warehouseQuantity, storeQuantity) {
    if (!productId) {
        throw new Error('Product ID is required');
    }

    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory) {
        throw new Error('Inventory not found for this product');
    }

    inventory.warehouseQuantity = warehouseQuantity;
    inventory.storeQuantity = storeQuantity;
    return await inventory.save();
}
async function checkAvailability(productId) {
    const product = await db.Product.findByPk(productId, {
        include: [{
            model: db.Inventory,
            as: 'inventory',
            attributes: ['warehouseQuantity', 'storeQuantity']
        }]
    });

    return product ? {
        name: product.name,
        warehouseQuantity: product.inventory ? product.inventory.warehouseQuantity : 0,
        storeQuantity: product.inventory ? product.inventory.storeQuantity : 0
    } : null;
}
async function getWarehouseInventory() {
    return await db.Inventory.findAll({ 
        where: { location: 'warehouse' }, 
        include: [db.Product] 
    });
}
async function getStoreInventory(storeId) {
    return await db.Inventory.findAll({
        where: { locationType: storeId },
        include: [{
            model: db.Product,
            attributes: ['name', 'SKU', 'description', 'price']
        }]
    });
}
async function checkStockLevels() {
    const inventories = await db.Inventory.findAll();
    inventories.forEach(inventory => {
        if (inventory.quantity < inventory.threshold) {
            notifyAdminReorder(inventory.productId);
        }
    });
}
async function transferProduct(productId, quantity, sourceLocation, targetLocation, userId) {
    const sourceInventory = await db.Inventory.findOne({
        where: { productId, locationType: sourceLocation }
    });
    if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new Error(`Insufficient stock in ${sourceLocation}`);
    }

    sourceInventory.quantity -= quantity;
    await sourceInventory.save();

    let targetInventory = await db.Inventory.findOne({
        where: { productId, locationType: targetLocation }
    });
    if (targetInventory) {
        targetInventory.quantity += quantity;
    } else {
        targetInventory = await db.Inventory.create({
            productId,
            locationType: targetLocation,
            quantity
        });
    }
    
    await targetInventory.save();

    //await logTransaction('stock_transfer', userId, `Transferred ${quantity} units of product ${productId} from ${sourceLocation} to ${targetLocation}`);

    return { 
        message: `Product transferred successfully from ${sourceLocation} to ${targetLocation} by ${userId}`,
        sourceInventory: sourceInventory.quantity,
        targetInventory: targetInventory.quantity
    };
}