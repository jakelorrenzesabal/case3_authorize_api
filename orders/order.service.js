const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    //cancelOrder,
    trackOrderStatus,
    processOrder,
    shipOrder,
    deliverOrder
};
async function getAllOrders() {
    return await db.Order.findAll({ where: { orderStatus: ['pendding', 'processed', 'shipped', 'delivered'] } });
}
async function getOrderById(id) {
    return await db.Order.findByPk(id);
}
async function createOrder(params) {
    const order = new db.Order(params);
    await order.save();
    return order;
}
async function updateOrder(id, params) {
    const order = await db.Order.findByPk(id);
    if (!order) throw 'Order not found';
    Object.assign(order, params);
    await order.save();
    return order;

    // const order = await getOrderById(id);
    // if (!order) throw 'Order not found';

    // Object.assign(order, params);
    // return await order.save();
} 
// async function cancelOrder(id) {
//     const order = await getById(id);
//     if (!order) throw 'Order not found';
//     if (order.orderStatus === 'cancel') throw 'Order is already cancelled';
//     order.orderStatus = 'cancel';
//     await order.save();
//     return order;

    // const order = await getOrderById(id);
    // if (!order) throw 'Order not found';

    // // Check if the user is already deactivated
    // if (order.orderStatus === 'cancel') throw 'Order is already cancelled';

    // // Set status to 'deactivated' and save
    // order.orderStatus = 'cancel';
    // await order.save();
//}
async function trackOrderStatus(id) {
    const order = await db.Order.findByPk(id, { attributes: ['orderStatus'] });
    if (!order) throw 'Order not found';
    return order.orderStatus;
}
async function processOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    // Check if the order is already processed
    if (order.orderStatus === 'processed') throw 'Order is already processed';

    // Set status to 'processed' and save
    order.orderStatus = 'processed';
    await order.save();
}
async function shipOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    // Check if the order is already processed
    if (order.orderStatus === 'shipped') throw 'Order is already shipped';

    // Set status to 'processed' and save
    order.orderStatus = 'shipped';
    await order.save();
}
async function deliverOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    // Check if the order is already processed
    if (order.orderStatus === 'delivered') throw 'Order is already delivered';

    // Set status to 'processed' and save
    order.orderStatus = 'delivered';
    await order.save();
}
// async function updateOrderStatus(id, status) {
//     const order = await db.Order.findByPk(id);
//     if (!order) throw 'Order not found';
//     order.status = status;
//     await order.save();
//     return order;
// }