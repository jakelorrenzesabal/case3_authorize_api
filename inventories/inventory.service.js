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
    if (!productId) {
        throw new Error('Product ID is required');
    }

    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory) {
        throw new Error('Inventory not found for this product');
    }

    inventory.quantity = quantity;
    return await inventory.save();
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
        name: product.name,
        quantity: product.inventory ? product.inventory.quantity : 0
    } : null;
}