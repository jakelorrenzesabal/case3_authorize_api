const express = require('express');
const router = express.Router();
const salesService = require('./sales.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');

// Routes
router.get('/daily', authorize([Role.Admin, Role.Staff]), getDailySales);
router.get('/range', authorize([Role.Admin, Role.Staff]), getDateRangeSales);
router.post('/update', authorize([Role.Admin]), updateSales);

module.exports = router;

function getDailySales(req, res, next) {
    const date = req.query.date || new Date();
    if (isNaN(new Date(date))) {
        return res.status(400).json({ message: "Invalid date provided" });
    }
    salesService
        .getDailySales(date)
        .then((sales) => res.json(sales || { message: "No sales data found for the specified date" }))
        .catch(next);
}

function getDateRangeSales(req, res, next) {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ message: "Invalid start or end date provided" });
    }
    salesService
        .getDateRangeSales(startDate, endDate)
        .then((sales) => res.json(sales))
        .catch(next);
}

function updateSales(req, res, next) {
    salesService
        .updateDailySales()
        .then((sales) => res.json(sales))
        .catch(next);
}
