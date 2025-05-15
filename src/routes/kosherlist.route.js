import express from 'express';
import { kosherlistController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/', safe(kosherlistController.getAllLists));
router.get('/:listId', safe(kosherlistController.getListById));
router.post('/create', safe(kosherlistController.createList));
router.put('/update/:listId', safe(kosherlistController.updateList));
router.delete('/delete/:listId', safe(kosherlistController.deleteList));
router.get('/country/:countryId', safe(kosherlistController.getListsByCountry));

export default router;
