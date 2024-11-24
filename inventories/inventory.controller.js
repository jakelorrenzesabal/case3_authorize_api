const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const inventoryService = require('../inventories/inventory.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');

router.get('/', authorize([Role.Admin, Role.Manager]), getInventory);
router.get('/:branchType', getInventoryByType)
//router.get('/:branchId', authorize([Role.Admin, Role.Manager]), getInventory);
router.post('/', authorize([Role.Admin, Role.Manager]), updateStock);

//router.get('/:id', /* authorize([Role.Manager, Role.Admin]), */ getInventoryById);

router.post('/transfer', authorize([Role.Admin, Role.Manager]), transferProductSchema, transferProduct);

module.exports = router;

function getInventory(req, res, next) {
    inventoryService.getInventory()
        .then(inventory => res.json(inventory))
        .catch(next);
}
function getInventoryByType(req, res, next) {
    inventoryService.getInventoryByType(req.params.branchType)
        .then(inventory => res.json(inventory))
        .catch(next);
}
function updateStock(req, res, next) {
    const { productId, quantity } = req.body;
    inventoryService.updateStockLevels(productId, quantity)
        .then(() => res.json({ message: 'Stock updated' }))
        .catch(next);
}
async function transferProduct(req, res, next) {
    const { productId, quantity, sourceLocation, targetLocation } = req.body;
    inventoryService.transferProduct(productId, quantity, sourceLocation, targetLocation)
        .then(result => res.json(result))
        .catch(next);
}
function transferProductSchema(req, res, next) {
    const schema = Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        sourceLocation: Joi.string().required(),
        targetLocation: Joi.string().required()
    });
    validateRequest(req, next, schema);
}