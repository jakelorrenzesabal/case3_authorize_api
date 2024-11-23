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

    // Fetch the active warehouse branch
    const warehouseBranch = await db.Branch.findOne({ where: { type: 'warehouse', branchStatus: 'active' } });
    if (!warehouseBranch) {
        throw new Error('No active warehouse branch found');
    }

    if (product) {
        // Update inventory for the existing product
        const inventory = await db.Inventory.findOne({ where: { productId: product.id, branchId: warehouseBranch.id } });
        if (inventory) {
            inventory.quantity += params.quantity || 1;
            await inventory.save();
        } else {
            await db.Inventory.create({
                productId: product.id,
                branchId: warehouseBranch.id,
                quantity: params.quantity || 1,
            });
        }
        return { message: 'Product already exists, inventory updated', product };
    }

    // Create a new product
    product = await db.Product.create({
        name: params.name,
        description: params.description,
        price: params.price,
        quantity: params.quantity,
        productStatus: 'active',
    });

    // Create inventory for the product in the warehouse
    await db.Inventory.create({
        productId: product.id,
        branchId: warehouseBranch.id,
        quantity: params.quantity || 1,
    });

    return { message: 'New product created and added to warehouse inventory', product };

    // let product = await db.Product.findOne({ where: { name: params.name } });

    // if (product) {
    //     // If product already exists, update the inventory in the given branch
    //     const inventory = await db.Inventory.findOne({
    //         where: { productId: product.id, branchId: params.branchId }
    //     });

    //     if (inventory) {
    //         inventory.quantity += params.quantity || 1;
    //         await inventory.save();
    //     } else {
    //         await db.Inventory.create({
    //             productId: product.id,
    //             quantity: params.quantity || 1,
    //             branchId: params.branchId // Associating product with the specific branch
    //         });
    //     }

    //     return { message: 'Product already exists, inventory updated', product };
    // } else {
    //     // Create a new product
    //     product = await db.Product.create({
    //         name: params.name,
    //         description: params.description,
    //         price: params.price,
    //         quantity: params.quantity,
    //         productStatus: 'active'
    //     });

    //     // Create inventory record for the specific branch
    //     await db.Inventory.create({
    //         productId: product.id,
    //         quantity: params.quantity || 1,
    //         branchId: params.branchId // Associating product with the specific branch
    //     });

    //     return { message: 'New product created', product };
    // }
    
    // let product = await db.Product.findOne({ where: { name: params.name } });

    // if (product) {
    //     // Update inventory if the product already exists
    //     const warehouseInventory = await db.Inventory.findOne({
    //         where: { productId: product.id, branchId: params.warehouseId }
    //     });

    //     if (warehouseInventory) {
    //         warehouseInventory.quantity += params.quantity || 0;
    //         await warehouseInventory.save();
    //     } else {
    //         await db.Inventory.create({
    //             productId: product.id,
    //             branchId: params.warehouseId,
    //             quantity: params.quantity || 0,
    //             threshold: params.threshold || 10
    //         });
    //     }

    //     return { message: 'Product already exists, inventory updated', product };
    // } else {
    //     // Create a new product
    //     product = await db.Product.create({
    //         name: params.name,
    //         description: params.description,
    //         price: params.price,
    //         quantity: params.quantity,
    //         productStatus: 'active',
    //         SKU: params.SKU
    //     });

    //     // Ensure a warehouse branch exists
    //     const warehouseBranch = await db.Branch.findOne({ where: { type: 'warehouse', branchStatus: 'active' } });
    //     if (!warehouseBranch) throw new Error('No active warehouse branch found');

    //     // Create inventory entry for the warehouse
    //     await db.Inventory.create({
    //         productId: product.id,
    //         branchId: warehouseBranch.id,
    //         quantity: params.quantity || 0,
    //         threshold: params.threshold || 10
    //     });

    //     return { message: 'New product created and assigned to warehouse', product };
    // }

    // let product = await db.Product.findOne({ where: { name: params.name } });
    // let branch = await db.Product.findOne({ where: { name: params.name } });

    // if (product) {
    //     // If product exists, update the inventory
    //     const warehouseInventory = await db.Inventory.findOne({
    //         where: { productId: product.id, branchId: branch.id }
    //     });

    //     if (warehouseInventory) {
    //         warehouseInventory.quantity += params.quantity || 0;
    //         await warehouseInventory.save();
    //     } else {
    //         // Create inventory for the warehouse if it doesn't exist
    //         const warehouseInventory = await db.Branch.findOne({
    //             where: { type: 'warehouse', branchStatus: 'active' }
    //         });
    //         //console.log("Warehouse Retrieved:", warehouse);

    //         if (!warehouseInventory) {
    //             throw new Error('No active warehouse found for the product');
    //         }

    //         await db.Inventory.create({
    //             productId: product.id,
    //             branchId: branch.id,
    //             quantity: params.quantity || 0,
    //             threshold: params.threshold || 10
    //         });
    //     }

    //     return { message: 'Product already exists, inventory updated', product };
    // } else {
    //     // Automatically find the warehouse based on the branch type
    //     const warehouseInventory = await db.Branch.findOne({
    //         where: { type: 'warehouse', branchStatus: 'active' }
    //     });

    //     if (!warehouseInventory) {
    //         throw new Error('No active warehouse found');
    //     }

    //     // Create the product
    //     product = await db.Product.create({
    //         name: params.name,
    //         description: params.description,
    //         price: params.price,
    //         quantity: params.quantity || 0,
    //         productStatus: 'active'
    //     });

    //     // Assign it to the warehouse inventory
    //     await db.Inventory.create({
    //         productId: product.id,
    //         branchId: branch.id,
    //         quantity: params.quantity || 0,
    //         threshold: params.threshold || 10
    //     });

    //     return { message: 'New product created and assigned to warehouse based on branch type', product };
    // }
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
    // const product = await getProductById(id);
    // if (!product) throw 'Product not found';

    // const additionalQuantity = params.quantity || 0; // Quantity to be added

    // if (additionalQuantity <= 0) {
    //     throw new Error('Quantity to add must be greater than zero');
    // }

    // // Update the product's quantity
    // product.quantity += additionalQuantity;
    // await product.save();

    // // Adjust the warehouse inventory
    // const warehouseInventory = await db.Inventory.findOne({
    //     where: { productId: id, locationType: 'warehouse' }
    // });

    // if (!warehouseInventory) {
    //     throw new Error('Warehouse inventory not found for the product');
    // }

    // // Increase the warehouse inventory quantity
    // warehouseInventory.quantity += additionalQuantity;
    // await warehouseInventory.save();

    // return {
    //     message: `Product quantity and warehouse inventory updated successfully.`,
    //     product: {
    //         id: product.id,
    //         name: product.name,
    //         totalQuantity: product.quantity
    //     },
    //     warehouseInventory: {
    //         location: warehouseInventory.locationType,
    //         quantity: warehouseInventory.quantity
    //     }
    // };

    const product = await getProductById(id);
    const additionalQuantity = params.quantity || 0;

    if (additionalQuantity <= 0) {
        throw new Error('Quantity to add must be greater than zero');
    }

    const warehouseInventory = await db.Inventory.findOne({
        where: { productId: id, locationType: 'warehouse' }
    });

    if (!warehouseInventory) {
        throw new Error('Warehouse inventory not found for the product');
    }

    warehouseInventory.quantity += additionalQuantity;
    await warehouseInventory.save();

    return {
        message: 'Product and warehouse inventory updated successfully',
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