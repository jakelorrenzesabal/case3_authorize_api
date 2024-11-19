const db = require('_helpers/db');

module.exports = {
    generateReport
};

async function generateReport(period, userId) {
    const today = new Date();
    let startDate, endDate = today;

    switch (period) {
        case 'daily':
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            break;
        case 'weekly':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            break;
        case 'monthly':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        default:
            throw new Error('Invalid period specified. Use "daily", "weekly", or "monthly".');
    }

    const totalOrders = await db.Order.count({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });
    const completedDeliveries = await db.Delivery.count({
        where: { deliveryStatus: 'delivered', updatedAt: { [Op.between]: [startDate, endDate] } }
    });
    const inventoryAdjustments = await db.ActivityLog.findAll({
        where: {
            actionType: { [Op.in]: ['stock_transfer', 'update_inventory'] },
            timestamp: { [Op.between]: [startDate, endDate] }
        }
    });

    // Save report in the database
    const report = await db.Report.create({
        period,
        startDate,
        endDate,
        totalOrders,
        completedDeliveries,
        inventoryAdjustments: inventoryAdjustments.map(log => ({
            id: log.id,
            actionDetails: log.actionDetails,
            timestamp: log.timestamp
        })),
        generatedBy: userId
    });

    return report;
}