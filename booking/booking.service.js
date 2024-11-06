const db = require('_helpers/db');
const { Op } = require('sequelize');

module.exports = {
    createBooking,
    getBookingById,
    cancelBooking,
    listUserBookings
};

// Create a new booking
async function createBooking(userId, { roomId, checkInDate, checkOutDate }) {
    if (!userId) {
        throw new Error("User ID is required to create a booking.");
    }

    // Ensure room exists
    const room = await db.Room.findByPk(roomId);
    if (!room) {
        throw new Error("Room not found.");
    }
    if (room.status === 'booked') {
        throw new Error("Room is already booked.");
    }

    // Check for overlapping dates as before, then create booking
    const overlappingBooking = await db.Booking.findOne({
        where: {
            roomId,
            status: 'confirmed',
            [Op.or]: [
                { checkInDate: { [Op.between]: [checkInDate, checkOutDate] } },
                { checkOutDate: { [Op.between]: [checkInDate, checkOutDate] } },
                { [Op.and]: [
                    { checkInDate: { [Op.lte]: checkInDate } },
                    { checkOutDate: { [Op.gte]: checkOutDate } }
                ]}
            ]
        }
    });

    if (overlappingBooking) {
        throw new Error('Room is already booked for these dates');
    }

    // Create the booking
    const booking = await db.Booking.create({
        userId,
        roomId,
        checkInDate,
        checkOutDate,
        status: 'confirmed'
    });

    room.status = 'booked'; // Set room status to booked
    await room.save();

    return booking;
}

// Get booking details by ID
async function getBookingById(bookingId, userId) {
    const booking = await db.Booking.findOne({
        where: { id: bookingId, userId },
        include: [{ model: db.Product, attributes: ['name', 'description', 'price'] }]
    });

    if (!booking) throw new Error('Booking not found');
    return booking;
}

// Cancel a booking
async function cancelBooking(bookingId, userId) {
    const booking = await db.Booking.findOne({ where: { id: bookingId, userId } });
    if (!booking) throw new Error('Booking not found');

    if (booking.status === 'canceled') throw new Error('Booking is already canceled');

    booking.status = 'canceled';
    await booking.save();

    return { message: 'Booking canceled successfully' };
}

// List all bookings for a user
async function listUserBookings(userId) {
    return await db.Booking.findAll({
        where: { userId },
        include: [{ model: db.Product, attributes: ['name', 'description', 'price'] }]
    });
}