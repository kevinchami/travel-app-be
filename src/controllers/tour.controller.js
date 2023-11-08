// controllers/tourController.js

import { tourService } from '../services/index.js';

export const addTour = async (req, res) => {
  try {
    const tour = await tourService.addTour(req.body);
    return res.status(201).json(tour);
  } catch (error) {
    throw new Error('Failed to add tour');
  }
};

export const addTourToCity = async (req, res) => {
  try {
    // Implement your logic here
  } catch (error) {
    throw new Error('Failed to add tour to city');
  }
};

export const getTours = async (req, res) => {
  try {
    const tours = await tourService.getTours();
    return res.status(200).json(tours);
  } catch (error) {
    throw new Error('Failed to fetch tours');
  }
};

export const getTourById = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await tourService.getTourById(tourId);
    return res.status(200).json(tour);
  } catch (error) {
    throw new Error('Tour not found');
  }
};

export const removeTourById = async (req, res) => {
  try {
    const { tourId } = req.params;
    const result = await tourService.removeTourById(tourId);
    return res.status(200).json({ message: 'Tour removed successfully' });
  } catch (error) {
    throw new Error('Failed to remove tour');
  }
};

export const updateTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const updatedData = req.body;
    const updatedTour = await tourService.updateTour(tourId, updatedData);
    return res.status(200).json(updatedTour);
  } catch (error) {
    throw new Error('Failed to update tour');
  }
};

export const getToursByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const tours = await tourService.getToursByCity(cityId);
    return res.status(200).json(tours);
  } catch (error) {
    throw new Error('Failed to fetch tours by city');
  }
};
