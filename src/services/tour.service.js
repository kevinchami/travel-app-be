// services/tourService.js

import Country from '../models/country.js';
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
  const result = await Tour.findByIdAndDelete(tourId);
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

export const getHighlightedToursByCountry = async countryName => {
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    throw new Error('Country not found');
  }

  const tours = await Tour.find({
    countryId: country._id.toString(), // Asegúrate de que la comparación sea con un String
    highlighted: true,
  }).sort({ priority: 1 });

  return tours;
};
