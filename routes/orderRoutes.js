const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.post('/', orderController.createOrder);

router.get('/user/:userId', orderController.getOrdersForUser);

router.get('/:orderId', orderController.getOrderById);

router.get('/',orderController.getAllOrders);

router.patch('/:orderId/status', orderController.updateOrderStatus);

router.delete('/:orderId', orderController.deleteOrder);

router.get('/count', orderController.getOrderCount);

module.exports = router;
