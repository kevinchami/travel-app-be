// import * as kosherListService from '../services/kosherlist.service.js';
import { kosherlistService } from '../services/index.js'

export const getAllLists = async (req, res) => {
  const lists = await kosherlistService.getAllLists();
  return res.status(200).json(lists);
};

export const getListById = async (req, res) => {
  const { listId } = req.params;
  const list = await kosherlistService.getListById(listId);
  if (!list) throw new Error('List not found');
  return res.status(200).json(list);
};

export const createList = async (req, res) => {
  const newList = await kosherlistService.createList(req.body);
  return res.status(201).json(newList);
};

export const updateList = async (req, res) => {
  const { listId } = req.params;
  const updatedList = await kosherlistService.updateList(listId, req.body);
  if (!updatedList) throw new Error('List not found');
  return res.status(200).json(updatedList);
};

export const deleteList = async (req, res) => {
  const { listId } = req.params;
  const deletedList = await kosherlistService.deleteList(listId);
  if (!deletedList) throw new Error('List not found');
  return res.status(200).json(deletedList);
};

export const getListsByCountry = async (req, res) => {
  const { countryId } = req.params;
  const lists = await kosherlistService.getListsByCountry(countryId);
  return res.status(200).json(lists);
};
