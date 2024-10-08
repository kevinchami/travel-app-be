import Accommodation from '../models/accomodation.js';
import City from '../models/city.js';
import Country from '../models/country.js';

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

export const getAccommodations = async () => {
  const accommodations = await Accommodation.find();
  return accommodations;
};

export const getAccommodationById = async accommodationId => {
  const accommodation = await Accommodation.findById(accommodationId);
  return accommodation;
};

export const getAccommodationsByCity = async cityId => {
  const accommodations = await Accommodation.find({ city: cityId });
  return accommodations;
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

export const filterAccommodationsByCountry = async countryName => {
  // Assuming you have a field named 'name' in your Country model
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    // Handle the case where the country doesn't exist
    return [];
  }

  // Now, use the obtained country._id to filter accommodations
  const accommodations = await Accommodation.find({ countryId: country._id });

  return accommodations;
};

export const filterHighlightAccommodationsByCountry = async countryName => {
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    return [];
  }

  // Filtrar por countryId y highlighted, y ordenar por priority
  const accommodations = await Accommodation.find({
    countryId: country._id,
    highlighted: true, // Filtrar por alojamientos destacados
  }).sort({ priority: 1 }); // Ordenar por priority en orden ascendente (1) o descendente (-1)

  return accommodations;
};
