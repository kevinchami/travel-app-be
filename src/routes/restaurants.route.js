import express from 'express';
import { restaurantController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addrestaurant', safe(restaurantController.addRestaurant));

router.get('/getrestaurants', safe(restaurantController.getRestaurants));

router.get(
  '/getrestaurant/:restaurantId',
  safe(restaurantController.getRestaurantById),
);

router.get(
  '/getrestaurantsbycity/:cityId',
  safe(restaurantController.getRestaurantsByCity),
);

router.delete(
  '/removerestaurant/:restaurantId',
  safe(restaurantController.removeRestaurantById),
);

router.put(
  '/updaterestaurant/:restaurantId',
  safe(restaurantController.updateRestaurant),
);

export default router;
