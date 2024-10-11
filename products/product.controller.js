const express = require('express');
const router = express.Router();
const productService = require('../products/product.service');
const inventoryService = require('../inventories/inventory.service');
const authorize = require('_middleware/authorize');
// const authenticate = require('_middleware/product-authenticate');
const Role = require('_helpers/role');

// router.get('/', getProduct);
// router.get('/:id', getProductById);
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);
// router.get('/:productId/availability', checkAvailability);

router.get('/', authorize([Role.Admin, Role.Manager, Role.User]), getProduct);
router.get('/:id', authorize([Role.Admin, Role.Manager, Role.User]), getProductById);
router.post('/', authorize([Role.Admin, Role.Manager]), createProduct);
router.put('/:id', authorize([Role.Admin, Role.Manager]), updateProduct);
router.get('/:productId/availability', authorize([Role.User]), checkAvailability);

module.exports = router;

function getProduct(req, res, next) {
    productService.getProduct()
        .then(products => res.json(products))
        .catch(next);
}
function getProductById(req, res, next) {
    productService.getProductById(req.params.id)
        .then(product => res.json(product))
        .catch(next);
}
function createProduct(req, res, next) {
    productService.createProduct(req.body)
        .then(() => res.json({ message: 'Product created' }))
        .catch(next);
}       
function updateProduct(req, res, next) {
    productService.updateProduct(req.params.id, req.body)
        .then(() => res.json({ message: 'Product updated' }))
        .catch(next);
}
function deleteProduct(req, res, next) {
    productService.deleteProduct(req.params.id, req.body)
        .then(() => res.json({ message: 'Product deleted' }))
        .catch(next);
}
function checkAvailability(req, res, next) {
    const productId = req.params.productId;

    inventoryService.checkAvailability(productId)
        .then(product => {
            if (!product) return res.status(404).json({ message: 'Product not found' });
            const available = product.quantity > 0;
            res.json({
                product: product.model,
                available,
                quantity: product.quantity
            });
        })
        .catch(next);
}

