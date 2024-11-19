const express = require('express');
const router = express.Router();
const customerService = require('./customer.service');
// const authorize = require('_middleware/authorize');
// const Role = require('_helpers/role');

router.get('/', getAll); 
router.post('/register', /* authorize([Role.Admin]), */ registerCustomer);
router.get('/:id', /* authorize([Role.Admin, Role.Staff]), */ getCustomerById);
router.put('/:id/points', /* authorize([Role.Admin]), */ updateLoyaltyPoints);

router.get('/:id/orderHistory', /* authorize([Role.Admin]), */ getCustomerOrderHistory);

module.exports = router;

function getAll(req, res, next) {
    customerService.getAll()
        .then(customer => res.json(customer))
        .catch(next);
}

function registerCustomer(req, res, next) {
    customerService.registerCustomer(req.body)
        .then(() => res.json({ message: 'Customer registered successfully' }))
        .catch(next);
}

function getCustomerById(req, res, next) {
    customerService.getCustomerById(req.params.id)
        .then(customer => res.json(customer))
        .catch(next);
}

function updateLoyaltyPoints(req, res, next) {
    customerService.updateLoyaltyPoints(req.params.id, req.body.points)
        .then(() => res.json({ message: 'Loyalty points updated' }))
        .catch(next);
}

function getCustomerOrderHistory(req, res, next) {
    customerService.getCustomerOrderHistory(req.params.id)
        .then(orders => res.json(orders))
        .catch(next);
}