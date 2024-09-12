const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');


router.post('/add', cartController.addItem);

router.delete('/remove/:userId/:productId', cartController.removeItem);

router.get('/:userId', cartController.getCartItems);

module.exports = router;
