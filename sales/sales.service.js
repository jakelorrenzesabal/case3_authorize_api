const db = require('_helpers/db');
const { Op } = require('sequelize');

module.exports = {
    updateDailySales,
    getDailySales,
    getDateRangeSales,
};

async function updateDailySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all completed orders for today
    const todayOrders = await db.Order.findAll({
        where: {
            createdAt: { [Op.gte]: today },
            orderStatus: { [Op.in]: ['delivered', 'shipped', 'processing'] },
        },
    });

    const totalSales = todayOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

    let dailySales = await db.DailySales.findOne({ where: { date: today } });

    if (dailySales) {
        dailySales.totalSales = totalSales;
        dailySales.totalOrders = todayOrders.length;
        dailySales.lastUpdated = new Date();
        await dailySales.save();
    } else {
        dailySales = await db.DailySales.create({
            date: today,
            totalSales,
            totalOrders: todayOrders.length,
            lastUpdated: new Date(),
        });
    }

    return dailySales;
}

async function getDailySales(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return await db.DailySales.findOne({ where: { date: targetDate } });
}

async function getDateRangeSales(startDate, endDate) {
    return await db.DailySales.findAll({
        where: {
            date: {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            },
        },
        order: [['date', 'ASC']],
    });
}
