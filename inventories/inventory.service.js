const db = require('_helpers/db');

module.exports = {
    getInventory,
    updateStockLevels,
    checkAvailability,
    getWarehouseInventory,
    checkStockLevels,
    transferProduct,
    checkInventoryLevels,
    getInventoryByType
};

async function getInventory(branchId) {
    return await db.Inventory.findAll({ 
        //where: { branchId },
        include: db.Product 
    });
}
async function getInventoryByType(branchType) {
    // Validate branch type
    if (!['warehouse', 'store'].includes(branchType)) {
        throw new Error('Invalid branch type. Allowed values are "warehouse" or "store".');
    }

    // Find branches of the specified type
    const branches = await db.Branch.findAll({ where: { type: branchType, branchStatus: 'active' } });

    if (!branches.length) {
        throw new Error(`No active branches found for type: ${branchType}`);
    }

    // Fetch inventory for all branches of this type
    const branchIds = branches.map(branch => branch.id);
    return await db.Inventory.findAll({
        where: { branchId: branchIds },
        include: [db.Product],
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
    return await db.Branch.findAll({ 
        where: { type: 'warehouse' }, 
        include: [db.Product] 
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
async function transferProduct(productId, quantity, sourceType, targetType, userId, ipAddress, browserInfo) {
    // Validate types
    if (!['warehouse', 'store'].includes(sourceType) || !['warehouse', 'store'].includes(targetType)) {
        throw new Error('Invalid source or target type. Allowed types: "warehouse", "store".');
    }

    // Find the source and target branches
    const sourceBranch = await db.Branch.findOne({ where: { type: sourceType, branchStatus: 'active' } });
    const targetBranch = await db.Branch.findOne({ where: { type: targetType, branchStatus: 'active' } });

    if (!sourceBranch) {
        throw new Error(`Source branch of type "${sourceType}" not found or is inactive.`);
    }
    if (!targetBranch) {
        throw new Error(`Target branch of type "${targetType}" not found or is inactive.`);
    }

    // Fetch source and target inventory
    const sourceInventory = await db.Inventory.findOne({ where: { productId, branchId: sourceBranch.id } });
    const targetInventory = await db.Inventory.findOne({ where: { productId, branchId: targetBranch.id } });

    if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new Error(`Insufficient stock in source location "${sourceType}" for Product ID: ${productId}.`);
    }

    // Update stock levels
    sourceInventory.quantity -= quantity;
    await sourceInventory.save();

    if (targetInventory) {
        targetInventory.quantity += quantity;
    } else {
        await db.Inventory.create({ productId, branchId: targetBranch.id, quantity });
    }

    // Log the transfer
    // await logActivity(
    //     userId,
    //     'stock_transfer',
    //     ipAddress,
    //     browserInfo,
    //     'inventory',
    //     productId,
    //     `Transferred ${quantity} units of Product ID ${productId} from ${sourceType} to ${targetType}`
    // );

    return {
        message: `Successfully transferred ${quantity} units of Product ID ${productId} from ${sourceType} to ${targetType}.`,
        sourceStock: sourceInventory.quantity,
        targetStock: targetInventory ? targetInventory.quantity : quantity,
    };
}
async function checkInventoryLevels(productId, branchId) {
    const inventory = await db.Inventory.findOne({ where: { productId, branchId } });

    if (!inventory) {
        throw new Error(`Inventory not found for product ID: ${productId} at branch ID: ${branchId}`);
    }

    if (inventory.quantity < inventory.threshold) {
        notifyAdminReorder(productId); // Implement this function to send alerts
    }

    return inventory;
}