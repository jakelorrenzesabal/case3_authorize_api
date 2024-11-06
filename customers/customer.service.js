const db = require('_helpers/db');

module.exports = {
    registerCustomer,
    getCustomerById,
    updateLoyaltyPoints
};

async function registerCustomer(params) {
    if (await db.Customer.findOne({ where: { email: params.email } })) {
        throw 'Customer already registered';
    }
    return await db.Customer.create(params);
}

async function getCustomerById(id) {
    return await db.Customer.findByPk(id, { include: db.Order });
}

async function updateLoyaltyPoints(customerId, points) {
    const customer = await db.Customer.findByPk(customerId);
    customer.loyaltyPoints += points;
    return await customer.save();
}