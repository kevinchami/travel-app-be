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
export const getTours = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Tour.find({}, null, options);
};

// Get a tour by ID
export const getTourById = async (tourId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const tour = await Tour.findById(tourId, null, options);
  if (!tour) throw new Error('Tour not found');
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
export const getToursByCity = async (cityId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const tours = await Tour.find({ city: cityId }, null, options);
  if (!tours) throw new Error('Failed to fetch tours by city');
  return tours;
};

export const getHighlightedToursByCountry = async (
  countryName,
  includeHidden = false,
) => {
  const country = await Country.findOne({ name: countryName });
  if (!country) throw new Error('Country not found');

  const filter = {
    countryId: country._id.toString(),
    highlighted: true,
  };

  if (includeHidden !== 'true') {
    filter.hide = { $ne: true };
  }

  return await Tour.find(filter).sort({ priority: 1 });
};
