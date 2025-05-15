import KosherList from '../models/kosherlist.js';

export const getAllLists = async () => {
  return await KosherList.find();
};

export const getListById = async listId => {
  return await KosherList.findById(listId);
};

export const createList = async data => {
  return await KosherList.create(data);
};

export const updateList = async (listId, updatedData) => {
  return await KosherList.findByIdAndUpdate(listId, updatedData, { new: true });
};

export const deleteList = async listId => {
  return await KosherList.findByIdAndDelete(listId);
};

export const getListsByCountry = async (countryId) => {
  return await KosherList.find({ country: countryId });
};
