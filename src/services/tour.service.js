// services/tourService.js

import Tour from '../models/tour.js';

// Add a tour
export const addTour = async tourData => {
  const tour = await Tour.create(tourData);
  if (!tour) {
    throw new Error('Failed to add tour');
  }
  return tour;
};

// Add a tour to a city
export const addTourToCity = async (cityId, tourData) => {
  // Implement your logic here
};

// Get all tours
export const getTours = async () => {
  const tours = await Tour.find();
  return tours;
};

// Get a tour by ID
export const getTourById = async tourId => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error('Tour not found');
  }
  return tour;
};

// Remove a tour by ID
export const removeTourById = async tourId => {
  const result = await Tour.findByIdAndRemove(tourId);
  if (!result) {
    throw new Error('Failed to remove tour');
  }
  return result;
};

// Update a tour
export const updateTour = async (tourId, updatedData) => {
  const updatedTour = await Tour.findByIdAndUpdate(tourId, updatedData, {
    new: true,
  });
  if (!updatedTour) {
    throw new Error('Failed to update tour');
  }
  return updatedTour;
};

// Get tours by city
export const getToursByCity = async cityId => {
  const tours = await Tour.find({ city: cityId });
  if (!tours) {
    throw new Error('Failed to fetch tours by city');
  }
  return tours;
};
