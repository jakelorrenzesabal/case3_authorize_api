const express = require('express');
const router = express.Router();
const Joi = require('joi');
const orderService = require('../orders/order.service');
const paymentService = require('../payment//payment.service');
const validateRequest = require('_middleware/validate-request');
// const authorize = require('_middleware/authorize');
// const Role = require('_helpers/role');

router.get('/', /* authorize([Role.Admin, Role.Manager]), */ getAllOrders);
router.get('/:id', /* authorize([Role.Admin, Role.Manager]), */ getOrderById);
router.post('/', /* authorize([Role.User]), */ createOrderSchema, createOrder);
router.put('/:id', /* authorize([Role.Admin, Role.Manager]), */ updateOrderSchema, updateOrder);
router.put('/:id/cancel', /* authorize([Role.Admin, Role.Manager, Role.User]), */ cancelOrder);
router.get('/:id/status', /* authorize([Role.User]), */ trackOrderStatus);
router.put('/:id/process', /* authorize([Role.Admin, Role.Manager]), */ processOrder);
router.put('/:id/ship', /* authorize([Role.Admin, Role.Manager]), */ shipOrder);
router.put('/:id/deliver', /* authorize([Role.Admin, Role.Manager]), */ deliverOrder);

module.exports = router;

function getAllOrders(req, res, next) {
    orderService.getAllOrders()
        .then(orders => res.json(orders))
        .catch(next);
}
function getOrderById(req, res, next) {
    orderService.getOrderById(req.params.id)
        .then(order => res.json(order))
        .catch(next);
}
function createOrder(req, res, next) {
    orderService.createOrder(req.body)
        .then(order => res.json(order))
        .catch(next);
}
function createOrderSchema(req, res, next) {
    const schema = Joi.object({
        customerId: Joi.number().required(),
        productId: Joi.number().required(),
        totalAmount: Joi.number().positive().required(),
        shippingAddress: Joi.string().required().max(500),
        salesChannel: Joi.string().valid('walk-in', 'online'),
        paymentMethod: Joi.string().valid('cash', 'card', 'digitalWallet'),
    });
    validateRequest(req, next, schema);
}
function updateOrderSchema(req, res, next) {
    const schema = Joi.object({
        orderProduct: Joi.string().max(500).optional(),
        totalAmount: Joi.number().positive().optional(),
        shippingAddress: Joi.string().max(500).optional(),
        orderStatus: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').optional()
    });
    validateRequest(req, next, schema);
}
function updateOrder(req, res, next) {
    orderService.updateOrder(req.params.id, req.body)
        .then(() => res.json({ message: 'Order updated' }))
        .catch(next);
}
function cancelOrder(req, res, next) {
    orderService.cancelOrder(req.params.id)
        .then(order => res.json(order))
        .catch(next);
}
function trackOrderStatus(req, res, next) {
    orderService.trackOrderStatus(req.params.id)
        .then(orderStatus => res.json({ orderStatus }))
        .catch(next);
}
function processOrder(req, res, next) {
    orderService.processOrder(req.params.id)
        .then(() => res.json({ message: 'Order processed' }))
        .catch(next);
}
function shipOrder(req, res, next) {
    orderService.shipOrder(req.params.id)
        .then(() => res.json({ message: 'Order shipped' }))
        .catch(next);
}
function deliverOrder(req, res, next) {
    orderService.deliverOrder(req.params.id)
        .then(() => res.json({ message: 'Order delivered' }))
        .catch(next);
}

router.post('/:id/pay', processPayment);
router.put('/:id/status', updateOrderStatus);

function processPayment(req, res, next) {
    const { paymentMethod, customerId } = req.body;
    paymentService.processPayment(req.params.id, { paymentMethod, customerId })
        .then(payment => res.json(payment))
        .catch(next);
}
function updateOrderStatus(req, res, next) {
    const { status } = req.body;
    orderService.updateOrderStatus(req.params.id, orderStatus)
        .then(order => {
            notifyCustomer(order.id, `Your order is now ${orderStatus}`);
            res.json(order);
        })
        .catch(next);
}

