import express from 'express';
import { partyController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addparty', safe(partyController.addParty));

router.get('/getparties', safe(partyController.getParties));

router.get('/getparty/:partyId', safe(partyController.getPartyById));

router.get('/getpartybycity/:cityId', safe(partyController.getPartiesByCity));

router.delete('/removeparty/:partyId', safe(partyController.removePartyById));

router.put('/updateparty/:partyId', safe(partyController.updateParty));

export default router;
