const express = require('express');
const router = express.Router();
const orderService = require('./order.service');

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/status', trackOrderStatus);
router.put('/:id/process', processOrder);
router.put('/:id/ship', shipOrder);
router.put('/:id/deliver', deliverOrder);

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
function updateOrder(req, res, next) {
    // orderService.updateOrder(req.params.id, req.body)
    //     .then(order => res.json(order))
    //     .catch(next);
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

