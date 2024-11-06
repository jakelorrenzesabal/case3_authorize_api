const db = require('_helpers/db');

module.exports = {
    processPayment,
    checkPaymentStatus
};

// Initiate a payment for a booking
async function processPayment(userId, { bookingId, amount }) {
    const booking = await db.Booking.findOne({ where: { id: bookingId, userId } });
    if (!booking || booking.status !== 'confirmed') throw new Error('Invalid booking for payment');

    // Create payment record
    const payment = await db.Payment.create({
        bookingId: booking.id,
        amount,
        status: 'pending'
    });

    // Here you would initiate the payment with a payment gateway
    // Example: const paymentResult = await paymentGateway.charge(amount);

    payment.status = 'completed';  // For demonstration, mark as completed
    await payment.save();

    return payment;
}

// Check the status of a payment
async function checkPaymentStatus(paymentId, userId) {
    const payment = await db.Payment.findOne({
        where: { id: paymentId },
        include: {
            model: db.Booking,
            where: { userId }  // Ensure the payment belongs to the user
        }
    });

    if (!payment) throw new Error('Payment not found');
    return { status: payment.status };
}