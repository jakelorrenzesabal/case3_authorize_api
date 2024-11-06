const express = require('express');
const router = express.Router();
const customerService = require('./customer.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');

router.post('/register', authorize([Role.Admin]), registerCustomer);
router.get('/:id', authorize([Role.Admin, Role.Staff]), getCustomerById);
router.put('/:id/points', authorize([Role.Admin]), updateLoyaltyPoints);

module.exports = router;

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