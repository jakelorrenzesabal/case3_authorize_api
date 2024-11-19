const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    cancelOrder,
    trackOrderStatus,
    processOrder,
    shipOrder,
    deliverOrder
};

async function getAllOrders(role, accountId) {
    const whereCondition = role === 'User'
        ? {
            AccountId: accountId,
            orderStatus: { [Sequelize.Op.not]: 'cancelled' }
          }
        : { orderStatus: ['pending', 'processing', 'shipped', 'delivered'] };

    return await db.Order.findAll({
        where: whereCondition,
        attributes: ['id', 'totalAmount', 'orderStatus', 'shippingAddress', 'createdAt', 'AccountId'],
        include: [
            ...(role !== 'User' ? [{
                model: db.Account,
                attributes: ['id', 'email'],
            }] : []),
            {
                model: db.Product,
                attributes: ['id', 'name', 'price'],
            }
        ],
        order: [['createdAt', 'DESC']],
    });
}

async function getOrderById(id) {
    return await db.Order.findByPk(id);
}

async function createOrder(params) {
    // Validate that the AccountId exists
    const account = await db.Account.findByPk(params.AccountId);
    if (!account) throw 'Account not found';

    // Validate that the Product exists and is active
    const product = await db.Product.findByPk(params.productId);
    if (!product) throw 'Product not found';
    if (product.productStatus !== 'active') throw 'Product is not available';

    const order = new db.Order(params);
    await order.save();
    
    // Fetch the order with account and product details
    const createdOrder = await db.Order.findByPk(order.id, {
        include: [
            { model: db.Account, attributes: ['id', 'email']},
            { model: db.Product,attributes: ['id', 'name', 'price']
            }
        ]
    });
    
    return createdOrder;
}

async function updateOrder(id, params) {
    const order = await db.Order.findByPk(id);
    if (!order) throw 'Order not found';
    if (order.orderStatus === 'cancelled') throw 'Cannot update a cancelled order';

    Object.assign(order, params);
    await order.save();
    return order;
}

async function cancelOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    // Check if the order is already cancelled
    if (order.orderStatus === 'cancelled') {
        throw 'Order is already cancelled';
    }

    // Only allow cancellation for pending or processing orders
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
        throw 'Cannot cancel order that has been shipped or delivered';
    }

    // Set status to 'cancelled' and save the order
    order.orderStatus = 'cancelled';
    await order.save();

    // Find the associated product and deactivate it if needed
    const product = await db.Product.findByPk(order.productId);
    if (product) {
        product.isAvailable = false;
        await product.save();
    }

    return order;
}

async function trackOrderStatus(id, accountId) {
    const order = await db.Order.findOne({
        where: { id, AccountId: accountId }, // Ensure the order belongs to the authenticated user
        attributes: ['orderStatus'],
    });
    if (!order) throw 'Order not found or unauthorized access';
    return order.orderStatus;
}

async function processOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';
    if (order.orderStatus === 'cancelled') throw 'Cannot process a cancelled order';

    order.orderStatus = 'processing';
    await order.save();
}

async function shipOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';
    if (order.orderStatus === 'cancelled') throw 'Cannot ship a cancelled order';

    order.orderStatus = 'shipped';
    await order.save();
}

async function deliverOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';
    if (order.orderStatus === 'cancelled') throw 'Cannot deliver a cancelled order';

    order.orderStatus = 'delivered';
    await order.save();
}