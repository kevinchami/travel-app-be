// --- routes/categoryRoutes.js ---
import express from 'express';
import { categoryController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/', safe(categoryController.getCategories));
router.get('/:categoryId', safe(categoryController.getCategoryById));
router.post('/', safe(categoryController.createCategory));
router.put('/:categoryId', safe(categoryController.updateCategory));
router.delete('/:categoryId', safe(categoryController.deleteCategory));

export default router;
