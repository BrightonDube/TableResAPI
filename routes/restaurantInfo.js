const express = require('express');
const router = express.Router();
const restaurantInfoController = require('../controllers/restaurantInfoController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRestaurantInfoInput } = require('../middleware/dataValidationMiddleware');

router.get('/restaurant-info', restaurantInfoController.getRestaurantInfo);

router.put(
    '/restaurant-info',
    verifyToken, 
    validateRestaurantInfoInput, 
    restaurantInfoController.upsertRestaurantInfo
);

router.delete('/restaurant-info', verifyToken, restaurantInfoController.deleteRestaurantInfo);

module.exports = router;