const express = require('express');
const router = express.Router();
const inventoryService = require('../inventories/inventory.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');

router.get('/', authorize([Role.Admin, Role.Manager]), getInventory);
router.post('/', authorize([Role.Admin, Role.Manager]), updateStock);

module.exports = router;

function getInventory(req, res, next) {
    inventoryService.getInventory()
        .then(inventory => res.json(inventory))
        .catch(next);
}
function updateStock(req, res, next) {
    const { productId, quantity } = req.body;
    inventoryService.updateStock(productId, quantity)
        .then(() => res.json({ message: 'Stock updated' }))
        .catch(next);
}
