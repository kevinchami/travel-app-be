import express from 'express';
import { memorialController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/getpeople', safe(memorialController.getPeople));

router.post('/addperson', safe(memorialController.addPerson));

router.delete('/removeperson/:id', safe(memorialController.removePerson)); // New route for removing a person
router.put('/updateperson/:id', safe(memorialController.updatePerson)); // New route for updating a person

export default router;
