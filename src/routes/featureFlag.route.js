import express from 'express';
import { fetchFeatureFlag, toggleFeatureFlag } from '../controllers/featureFlag.controller.js';

const router = express.Router();

router.get('/:featureName', fetchFeatureFlag); // Obtener el estado de la flag
router.patch('/:featureName', toggleFeatureFlag); // Actualizar la flag

export default router;
