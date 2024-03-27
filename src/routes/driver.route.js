// routes/driverRoutes.js

import express from 'express';
import { DriverController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/adddriver', safe(DriverController.addDriver));

router.get('/getdrivers', safe(DriverController.getDrivers));

router.get('/getdriver/:driverId', safe(DriverController.getDriverById));

router.delete(
  '/removedriver/:driverId',
  safe(DriverController.removeDriverById),
);

router.put('/updatedriver/:driverId', safe(DriverController.updateDriver));
router.get(
  '/getdriversbycity/:cityId',
  safe(DriverController.getDriversByCity),
);

export default router;
