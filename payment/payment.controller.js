const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const paymentService = require('./payment.service');
const validateRequest = require('_middleware/validate-request');

// Route to initiate a payment
router.post('/', /* authorize(Role.User), */ initiatePaymentSchema, processPayment);

// Route to check payment status
router.get('/status/:id', /* authorize(Role.User), */ checkPaymentStatus);

module.exports = router;

// Schema validation for initiating a payment
function initiatePaymentSchema(req, res, next) {
    const schema = Joi.object({
        bookingId: Joi.number().integer().required(),
        amount: Joi.number().positive().required()
    });
    validateRequest(req, next, schema);
}

// Controller function to process payment
function processPayment(req, res, next) {
    paymentService.processPayment(req.user.id, req.body)
        .then(payment => res.json(payment))
        .catch(next);
}

// Controller function to check payment status
function checkPaymentStatus(req, res, next) {
    paymentService.checkPaymentStatus(req.params.id, req.user.id)
        .then(status => res.json(status))
        .catch(next);
}