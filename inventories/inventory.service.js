const db = require('_helpers/db');

module.exports = {
    getInventory,
    updateStock,
    checkAvailability
};

async function getInventory() {
    return await db.Inventory.findAll({ include: db.Product });
}
async function updateStock(productId, quantity) {
    // const inventory = await db.Inventory.findOne({ where: { productId } });
    // if (inventory) {
    //     inventory.quantity += quantity;
    //     await inventory.save();
    // } else {
    //     await db.Inventory.create({ productId, quantity });
    // }
    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory) throw 'Inventory not found for this product';

    // Update stock level
    inventory.quantity = quantity;
    await inventory.save();
    
    return inventory;
}
async function checkAvailability(productId) {
    // Fetch product and its inventory details
    const product = await db.Product.findByPk(productId, {
        include: [{
            model: db.Inventory,
            as: 'inventory',
            attributes: ['quantity']  // Assuming inventory model has a 'quantity' field
        }]
    });

    return product ? {
        model: product.model,
        quantity: product.inventory ? product.inventory.quantity : 0
    } : null;
}