// --- controllers/categoryController.js ---

import { categoryService } from '../services/index.js';

export const getCategories = async (req, res) => {
  const categories = await categoryService.getCategories();
  res.status(200).json(categories);
};

export const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryService.getCategoryById(categoryId);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.status(200).json(category);
};

export const createCategory = async (req, res) => {
  const newCategory = await categoryService.createCategory(req.body);
  res.status(201).json(newCategory);
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const updatedCategory = await categoryService.updateCategory(
    categoryId,
    req.body,
  );
  if (!updatedCategory)
    return res.status(404).json({ error: 'Category not found' });
  res.status(200).json(updatedCategory);
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const deleted = await categoryService.deleteCategory(categoryId);
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.status(200).json({ message: 'Category deleted successfully' });
};
