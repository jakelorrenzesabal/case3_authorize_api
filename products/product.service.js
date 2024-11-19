const db = require('_helpers/db');
const { generateSKU } = require('../_helpers/skuGenerator');
const { Sequelize } = require('sequelize');

module.exports = {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deactivate,
    reactivate,
    addProductQuantity
};

async function getProduct() {
    return await db.Product.findAll({ where: { productStatus: 'active' } });
}
async function getProductById(id) {
    const product = await db.Product.findByPk(id);

    // Check if the product exists
    if (!product) {
        throw new Error('Invalid product ID');
    }

    // Check if the product is active
    await checkIfActive(product);
    return product;
}
async function createProduct(params) {
    let product = await db.Product.findOne({ where: { name: params.name } });

    if (product) {
        const inventory = await db.Inventory.findOne({ where: { productId: product.id } });
        
        if (inventory) {
            inventory.quantity += params.quantity || 1;
            await inventory.save();

            //await logTransaction('update_inventory', userId, `Updated inventory for product: ${product.name}, new quantity: ${inventory.quantity}`);
        } else {
            await db.Inventory.createProduct({
                productId: product.id,
                quantity: params.quantity || 1
            });

            //await logTransaction('create_inventory', userId, `Created inventory for product: ${product.name}, quantity: ${params.quantity || 1}`);
        } 

        return { message: 'Product already exists, inventory updated', product };
    } else {
        product = await db.Product.create({
            name: params.name,
            description: params.description,
            price: params.price,
            quantity: params.quantity,
            productStatus: 'active'
        });

        await db.Inventory.create({
            productId: product.id,
            quantity: params.quantity || 1
        });

        //await logTransaction('create_product', userId, `Created new product: ${product.name}, quantity: ${params.quantity || 1}`);

        return { message: 'New product created', product };
    }
}
async function updateProduct(id, params) {
    // const product = await getProductById(id);
    // if (!product) throw 'Product not found';
    // await checkIfActive(product);
    // Object.assign(product, params);
    // return await product.save();
    
    const product = await getProductById(id);
    if (!product) throw 'Product not found';

    const oldQuantity = product.quantity;
    const newQuantity = params.quantity || oldQuantity;

    // Update the product details
    Object.assign(product, params);
    await product.save();

    // Adjust the warehouse inventory
    if (oldQuantity !== newQuantity) {
        const warehouseInventory = await db.Inventory.findOne({ 
            where: { productId: id, locationType: 'warehouse' } 
        });

        if (!warehouseInventory) {
            throw new Error('Warehouse inventory not found for the product');
        }

        // Adjust warehouse inventory quantity
        warehouseInventory.quantity += newQuantity + oldQuantity;
        await warehouseInventory.save();
    }

    return product;
}
//------------------------- Deactivate product -------------------------
async function deactivate(id) {
    const product = await getProductById(id);
    if (!product) throw 'Product not found';

    // Check if the product is already deactivated
    if (product.productStatus === 'deactivated') throw 'Product is already deactivated';

    // Set status to 'deactivated' and save
    product.productStatus = 'deactivated';
    await product.save();
}
async function reactivate(id) {
    const product = await getProductById(id);
    if (!product) throw 'Product not found';

    // Check if the product is already active
    if (product.productStatus === 'active') throw 'Product is already active';

    // Set status to 'active' and save
    product.productStatus = 'active';
    await product.save();
}
// Helper function to check if the product is active
async function checkIfActive(product) {
    if (product.productStatus === 'deactivated') {
        throw new Error('Product is deactivated');
    }
}

async function addProductQuantity(id, params) {
    const product = await getProductById(id);
    if (!product) throw 'Product not found';

    const additionalQuantity = params.quantity || 0; // Quantity to be added

    if (additionalQuantity <= 0) {
        throw new Error('Quantity to add must be greater than zero');
    }

    // Update the product's quantity
    product.quantity += additionalQuantity;
    await product.save();

    // Adjust the warehouse inventory
    const warehouseInventory = await db.Inventory.findOne({
        where: { productId: id, locationType: 'warehouse' }
    });

    if (!warehouseInventory) {
        throw new Error('Warehouse inventory not found for the product');
    }

    // Increase the warehouse inventory quantity
    warehouseInventory.quantity += additionalQuantity;
    await warehouseInventory.save();

    return {
        message: `Product quantity and warehouse inventory updated successfully.`,
        product: {
            id: product.id,
            name: product.name,
            totalQuantity: product.quantity
        },
        warehouseInventory: {
            location: warehouseInventory.locationType,
            quantity: warehouseInventory.quantity
        }
    };
}