const db = require('_helpers/db');

// module.exports = {
//     getInventory,
//     updateStock,
//     checkAvailability
// };

// async function getInventory() {
//     return await db.Inventory.findAll({ include: db.Product });
// }
// async function updateStock(productId, quantity) {
//     if (!productId) {
//         throw new Error('Product ID is required');
//     }

//     const inventory = await db.Inventory.findOne({ where: { productId } });
//     if (!inventory) {
//         throw new Error('Inventory not found for this product');
//     }

//     inventory.quantity = quantity;
//     return await inventory.save();
// }
// async function checkAvailability(productId) {
//     // Fetch product and its inventory details
//     const product = await db.Product.findByPk(productId, {
//         include: [{
//             model: db.Inventory,
//             as: 'inventory',
//             attributes: ['quantity']  // Assuming inventory model has a 'quantity' field
//         }]
//     });

//     return product ? {
//         name: product.name,
//         quantity: product.inventory ? product.inventory.quantity : 0
//     } : null;
// }


module.exports = {
    getInventory,
    updateStockLevels,
    checkAvailability,
    checkReorderAlert
};

async function getInventory() {
    // Fetch all inventory items with related product info
    return await db.Inventory.findAll({ 
        include: db.Product 
    });
}

// Update stock levels for both warehouse and store quantities
async function updateStockLevels(productId, warehouseQuantity, storeQuantity) {
    if (!productId) {
        throw new Error('Product ID is required');
    }

    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory) {
        throw new Error('Inventory not found for this product');
    }

    // Update both warehouse and store quantities
    inventory.warehouseQuantity = warehouseQuantity;
    inventory.storeQuantity = storeQuantity;
    return await inventory.save();
}

// Check availability for a product, showing both warehouse and store quantities
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

// Check if reorder alert is needed based on warehouse stock level
async function checkReorderAlert(productId) {
    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory) {
        throw new Error('Inventory not found for this product');
    }

    // Trigger alert if warehouse stock is below the reorder level
    return inventory.warehouseQuantity < inventory.reorderLevel
        ? { alert: true, message: `Reorder needed for product ${productId}` }
        : { alert: false };
}