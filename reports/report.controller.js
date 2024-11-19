const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
// const authorize = require('_middleware/authorize');
// const Role = require('_helpers/role');
const reportService = require('../reports/report.service');

router.get('/:period', /* authorize(Role.Admin), */ generateReport);

function generateReport(req, res, next) {
    const { period } = req.params;
    const userId = req.user.id; // Assuming `req.user` is populated by middleware

    reportService.generateReport(period, userId)
        .then(report => res.json(report))
        .catch(next);
}