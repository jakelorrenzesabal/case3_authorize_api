const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const paymentService = require('./payment.service');
const validateRequest = require('_middleware/validate-request');

router.post('/', authorize(Role.User), initiatePaymentSchema, processPayment);
router.get('/status/:id', authorize(Role.User), checkPaymentStatus);

module.exports = router;

function initiatePaymentSchema(req, res, next) {
    const schema = Joi.object({
        bookingId: Joi.number().integer().required(),
        amount: Joi.number().positive().required()
    });
    validateRequest(req, next, schema);
}

function processPayment(req, res, next) {
    paymentService.processPayment(req.user.id, req.body)
        .then(payment => res.json(payment))
        .catch(next);
}

function checkPaymentStatus(req, res, next) {
    paymentService.checkPaymentStatus(req.params.id, req.user.id)
        .then(status => res.json(status))
        .catch(next);
}