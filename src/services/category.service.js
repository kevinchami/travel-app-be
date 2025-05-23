// --- services/categoryService.js ---

import Category from '../models/category.js';

export const getCategories = async (lang = 'en') => {
  const categories = await Category.find({ hide: { $ne: true } }).sort({
    priority: 1,
  });
  return categories;
};

export const getCategoryById = async categoryId => {
  return await Category.findById(categoryId);
};

export const createCategory = async categoryData => {
  return await Category.create(categoryData);
};

export const updateCategory = async (categoryId, updateData) => {
  return await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
  });
};

export const deleteCategory = async categoryId => {
  return await Category.findByIdAndDelete(categoryId);
};
