const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    processPayment,
    checkPaymentStatus
};

async function processPayment(orderId, paymentDetails) {
    const order = await db.Order.findByPk(orderId);
    if (!order) throw 'Order not found';

    const payment = new db.Payment({
        orderId: order.id,
        paymentMethod: paymentDetails.paymentMethod,
        paymentStatus: 'completed'
    });

    await payment.save();

    order.orderStatus = 'processed';
    await order.save();

    return payment;
}

async function checkPaymentStatus(paymentId, userId) {
    const payment = await db.Payment.findOne({
        where: { id: paymentId },
        include: {
            model: db.Order,
            where: { userId }
        }
    });

    if (!payment) throw new Error('Payment not found');
    return { status: payment.status };
}