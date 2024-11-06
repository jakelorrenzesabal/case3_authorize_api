const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const roomService = require('./room.service');
const validateRequest = require('_middleware/validate-request');

// Route to get all rooms (available to any user role)
router.get('/', /* authorize([Role.User, Role.Admin]), */ getAllRooms);

// Route to create a new room (Admin only)
router.post('/', /* authorize(Role.Admin), */ createRoomSchema, createRoom);

module.exports = router;

// Validation schema for creating a room
function createRoomSchema(req, res, next) {
    const schema = Joi.object({
        roomNumber: Joi.string().required(),
        roomType: Joi.string().required(),
        capacity: Joi.number().integer().required(),
        pricePerNight: Joi.number().positive().required(),
        status: Joi.string().valid('available', 'booked').default('available')
    });
    validateRequest(req, next, schema);
}

// Controller function to create a room
function createRoom(req, res, next) {
    roomService.createRoom(req.body)
        .then(room => res.json(room))
        .catch(next);
}

// Controller function to get all rooms
function getAllRooms(req, res, next) {
    roomService.getAllRooms()
        .then(rooms => res.json(rooms))
        .catch(next);
}