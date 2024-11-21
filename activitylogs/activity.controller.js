// const express = require('express');
// const router = express.Router();
// const logService = require('../activitylog.service');

// router.get('/', /* authorize(Role.Admin), */ getLogs);

// module.exports = router;

// function getLogs(req, res, next) {
//     const filters = {
//         userId: req.query.userId,
//         actionType: req.query.actionType,
//         startDate: req.query.startDate,
//         endDate: req.query.endDate
//     };

//     logService.getLogs(filters)
//         .then(logs => res.json(logs))
//         .catch(next);
// }