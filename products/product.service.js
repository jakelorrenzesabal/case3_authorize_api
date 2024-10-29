const db = require('_helpers/db');

module.exports = {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

async function getProduct() {
    return await db.Product.findAll({ where: { status: 'active' } });
}
async function getProductById(id) {
    return await db.Product.findByPk(id);
}
async function createProduct(params) {
    let product = await db.Product.findOne({ where: { model: params.model } });

    if (product) {
        // Product exists, update the inventory quantity
        const inventory = await db.Inventory.findOne({ where: { productId: product.id } });
        
        if (inventory) {
            inventory.quantity += params.quantity || 1; // Increase the quantity by the given value or by 1 if not specified
            await inventory.save();
        } else {
            // If no inventory exists for the product, create it (this should generally not happen if managed correctly)
            await db.Inventory.createProduct({
                productId: product.id,
                quantity: params.quantity || 1
            });
        }

        return { message: 'Product already exists, inventory updated', product };
    } else {
        // Product doesn't exist, create a new product
        product = await db.Product.create({
            model: params.model,
            brand: params.brand,
            price: params.price,
            status: 'active'
        });

        // Create inventory for the new product
        await db.Inventory.create({
            productId: product.id,
            quantity: params.quantity || 1
        });

        return { message: 'New product created', product };
    }
}
async function updateProduct(id, params) {
    const product = await getProductById(id);
    if (!product) throw 'Product not found';

    Object.assign(product, params);
    return await product.save();
}
async function deleteProduct(productId) {
    // Find the product by ID
    const product = await db.Product.findByPk(productId);
    if (!product) {
        throw 'Product not found';
    }

    // Delete the inventory associated with the product (if exists)
    await db.Inventory.destroy({
        where: { productId: product.id }
    });

    // Delete the product
    await product.destroy();

    return { message: 'Product deleted permanently' };
}


