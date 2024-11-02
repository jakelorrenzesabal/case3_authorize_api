const express = require('express');
const router = express.Router();
const Joi = require('joi');
const orderService = require('./order.service');
const authorize = require('_middleware/authorize');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');

router.get('/', authorize([Role.Admin, Role.Manager]), getAllOrders);
router.get('/:id', authorize([Role.Admin, Role.Manager]), getOrderById);
router.post('/', authorize([Role.User]), createOrderSchema, createOrder);
router.put('/:id', authorize([Role.Admin, Role.Manager]), updateOrderSchema, updateOrder);
router.put('/:id/cancel', authorize([Role.Admin, Role.Manager, Role.User]), cancelOrder);
router.get('/:id/status', authorize([Role.Admin, Role.Manager]), trackOrderStatus);
router.put('/:id/process', authorize([Role.Admin, Role.Manager]), processOrder);
router.put('/:id/ship', authorize([Role.Admin, Role.Manager]), shipOrder);
router.put('/:id/deliver', authorize([Role.Admin, Role.Manager]), deliverOrder);

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
        userId: Joi.number().required(),
        items: Joi.array().items(Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number().positive().required(),
            price: Joi.number().positive().required()
        })).min(1).required(),
        totalAmount: Joi.number().positive().required(),
        shippingAddress: Joi.string().required().max(500),
        paymentMethod: Joi.string().valid('credit_card', 'paypal', 'bank_transfer').required()
    });
    validateRequest(req, next, schema);
}

// Validation schema for updating an order
function updateOrderSchema(req, res, next) {
    const schema = Joi.object({
        userId: Joi.number().optional(),
        items: Joi.array().items(Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number().positive().required(),
            price: Joi.number().positive().required()
        })).min(1).optional(),
        totalAmount: Joi.number().positive().optional(),
        shippingAddress: Joi.string().max(500).optional(),
        paymentMethod: Joi.string().valid('credit_card', 'paypal', 'bank_transfer').optional(),
        status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').optional()
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

