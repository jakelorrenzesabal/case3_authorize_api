const db = require('_helpers/db');

module.exports = {
    getAllRooms,
    createRoom
};

// Retrieve all rooms
async function getAllRooms() {
    return await db.Room.findAll();
}

// Create a new room
async function createRoom(params) {
    // Check if the room number already exists
    if (await db.Room.findOne({ where: { roomNumber: params.roomNumber } })) {
        throw new Error(`Room number "${params.roomNumber}" is already taken`);
    }

    // Create and save the new room
    const room = await db.Room.create(params);
    return room;
}