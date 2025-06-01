import Accommodation from '../models/accomodation.js';
import City from '../models/city.js';
import Country from '../models/country.js';
import { cleanTypes } from './search.service.js';

export const addAccommodation = async accommodationData => {
  const accommodation = await Accommodation.create(accommodationData);
  return accommodation;
};

export const addAccommodationToCity = async (
  cityId,
  name,
  description,
  price,
  contact,
  imageUrl,
  rating,
  review,
  location,
  latitude,
  longitude,
  type,
  facilities,
) => {
  const newAccommodation = await Accommodation.create({
    city: cityId,
    name,
    description,
    price,
    contact,
    imageUrl,
    rating,
    review,
    location,
    coordinates: { latitude, longitude },
    type,
    facilities,
  });

  await City.findByIdAndUpdate(cityId, {
    $push: { accommodations: newAccommodation._id },
  });

  return newAccommodation;
};

export const getAccommodations = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Accommodation.find({}, null, options);
};

export const getAccommodationById = async (
  accommodationId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Accommodation.findById(accommodationId, null, options);
};

export const getAccommodationsByCity = async (
  cityId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Accommodation.find({ city: cityId }, null, options);
};

export const removeAccommodationById = async accommodationId => {
  const result = await Accommodation.findByIdAndDelete(accommodationId);
  return result;
};

export const updateAccommodation = async (accommodationId, updatedData) => {
  const updatedAccommodation = await Accommodation.findByIdAndUpdate(
    accommodationId,
    updatedData,
    { new: true },
  );
  return updatedAccommodation;
};

export const filterAccommodationsByCountry = async (
  countryName,
  includeHidden = false,
) => {
  const country = await Country.findOne({ name: countryName });
  if (!country) return [];

  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Accommodation.find({ countryId: country._id }, null, options);
};

export const filterHighlightAccommodationsByCountry = async (
  countryName,
  includeHidden = false,
) => {
  const country = await Country.findOne({ name: countryName });
  if (!country) return [];

  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Accommodation.find(
    { countryId: country._id, highlighted: true },
    null,
    options,
  ).sort({ priority: 1 });
};

export const filterHighlightAccommodationsByCity = async (
  cityId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Accommodation.find(
    { city: cityId, highlighted: true },
    null,
    options,
  ).sort({ priority: 1 });
};

export const getAllAccommodationDetails = async () => {
  const rawDetails = await Accommodation.distinct('details', {
    hide: { $ne: true },
  });
  const cleanedDetails = cleanTypes(rawDetails);
  return cleanedDetails;
};
