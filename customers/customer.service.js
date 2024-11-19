// const db = require('_helpers/db');

// module.exports = {
//     getAll,
//     registerCustomer,
//     getCustomerById,
//     updateLoyaltyPoints,
//     getCustomerOrderHistory
// };

// async function getAll() {
//     return await db.Customer.findAll();
// }

// async function registerCustomer(params) {
//     if (await db.Customer.findOne({ where: { email: params.email } })) {
//         throw 'Customer already registered';
//     }
//     return await db.Customer.create(params);
// }

// async function getCustomerById(id) {
//     return await db.Customer.findByPk(id, { include: db.Order } );
// }

// async function updateLoyaltyPoints(customerId, points) {
//     const customer = await db.Customer.findByPk(customerId);
//     customer.loyaltyPoints += points;
//     return await customer.save();
// }

// async function getCustomerOrderHistory(id) {
//     return await db.Order.findAll({
//         where: { id },
//         order: [['createdAt', 'DESC']],
//     });
// }