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
    const { includeHidden } = req.query;
    const tours = await tourService.getTours(includeHidden);
    return res.status(200).json(tours);
  } catch (error) {
    throw new Error('Failed to fetch tours');
  }
};

export const getTourById = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { includeHidden } = req.query;
    const tour = await tourService.getTourById(tourId, includeHidden);
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
    const { includeHidden } = req.query;
    const tours = await tourService.getToursByCity(cityId, includeHidden);
    return res.status(200).json(tours);
  } catch (error) {
    throw new Error('Failed to fetch tours by city');
  }
};

export const getHighlightedTourByCountry = async (req, res) => {
  const { countryName } = req.params;
  const { includeHidden } = req.query;

  try {
    const tours = await tourService.getHighlightedToursByCountry(
      countryName,
      includeHidden,
    );
    return res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching highlighted tours by country:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHighlightedToursByCity = async (req, res) => {
  const { cityId } = req.params;
  const { includeHidden } = req.query;

  try {
    const tours = await tourService.getHighlightedToursByCity(
      cityId,
      includeHidden,
    );
    return res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching highlighted tours by city:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
