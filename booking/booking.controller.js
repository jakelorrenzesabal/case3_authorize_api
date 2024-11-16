const express = require('express');
const router = express.Router();
const Joi = require('joi');
//const authorize = require('_middleware/authorize');
//const Role = require('_helpers/role');
const bookingService = require('./booking.service');
const validateRequest = require('_middleware/validate-request');

// Route to create a new booking
router.post('/', /* authorize(Role.User), */ createBookingSchema, createBooking);

// Route to get a specific booking by ID
router.get('/:id', /* authorize(Role.User), */ getBookingById);

// Route to cancel a booking
router.put('/:id/cancel', /* authorize(Role.User), */ cancelBooking);

// Route to list all bookings for the authenticated user
router.get('/', /* authorize(Role.User), */ listUserBookings);

module.exports = router;

// Schema validation for creating a booking
function createBookingSchema(req, res, next) {
    const schema = Joi.object({
        roomId: Joi.number().integer().required(),
        checkInDate: Joi.date().required(),
        checkOutDate: Joi.date().greater(Joi.ref('checkInDate')).required()
    });
    validateRequest(req, next, schema);
}

// Controller function to handle booking creation
function createBooking(req, res, next) {
    bookingService.createBooking(req.user.id, req.body)
        .then(booking => res.json(booking))
        .catch(next);
}

// Controller function to get a booking by ID
function getBookingById(req, res, next) {
    bookingService.getBookingById(req.params.id, req.user.id)
        .then(booking => res.json(booking))
        .catch(next);
}

// Controller function to cancel a booking
function cancelBooking(req, res, next) {
    bookingService.cancelBooking(req.params.id, req.user.id)
        .then(message => res.json(message))
        .catch(next);
}

// Controller function to list all bookings for a user
function listUserBookings(req, res, next) {
    bookingService.listUserBookings(req.user.id)
        .then(bookings => res.json(bookings))
        .catch(next);
}