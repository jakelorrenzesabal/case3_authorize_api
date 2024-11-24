const express = require('express');
const router = express.Router();
const warehouseService = require('./warehouse.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');

router.get('/', authorize([Role.Admin]), getWarehouseStock);
router.put('/bulk-update', authorize([Role.Admin]), updateBulkStock);
router.post('/transfer', authorize([Role.Admin]), transferToStore);
router.get('/levels/:id', authorize([Role.Admin]), checkWarehouseLevels);
router.put('/minimum-level', authorize([Role.Admin]), setMinimumBulkLevel);
router.get('/low-stock', authorize([Role.Admin]), getLowBulkStock);

module.exports = router;

function getWarehouseStock(req, res, next) {
    warehouseService.getWarehouseStock()
        .then(stock => res.json(stock))
        .catch(next);
}

function updateBulkStock(req, res, next) {
    const { productId, quantity } = req.body;
    warehouseService.updateBulkStock(productId, quantity)
        .then(stock => res.json(stock))
        .catch(next);
}

function transferToStore(req, res, next) {
    const { productId, quantity } = req.body;
    warehouseService.transferToStore(productId, quantity)
        .then(result => res.json(result))
        .catch(next);
}

function checkWarehouseLevels(req, res, next) {
    warehouseService.checkWarehouseLevels(req.params.id)
        .then(levels => res.json(levels))
        .catch(next);
}

function setMinimumBulkLevel(req, res, next) {
    const { productId, minimumLevel } = req.body;
    warehouseService.setMinimumBulkLevel(productId, minimumLevel)
        .then(warehouse => res.json(warehouse))
        .catch(next);
}

function getLowBulkStock(req, res, next) {
    warehouseService.getLowBulkStock()
        .then(items => res.json(items))
        .catch(next);
}