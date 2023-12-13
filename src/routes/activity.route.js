import express from 'express';
import { ActivityController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addactivity', safe(ActivityController.addActivity));

router.get('/getactivities', safe(ActivityController.getActivities));

router.get(
  '/getactivity/:activityId',
  safe(ActivityController.getActivityById),
);

router.delete(
  '/removeactivity/:activityId',
  safe(ActivityController.removeActivityById),
);

router.put(
  '/updateactivity/:activityId',
  safe(ActivityController.updateActivity),
);

router.get(
  '/getactivitiesbycity/:cityId',
  safe(ActivityController.getActivitiesByCity),
);

export default router;
