import Accommodation from '../models/accomodation.js';
import City from '../models/city.js';

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
  const result = await Accommodation.findByIdAndRemove(accommodationId);
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
