import { accommodationService } from '../services/index.js';

export const addAccommodation = async (req, res) => {
  const accommodation = await accommodationService.addAccommodation(req.body);
  return res.status(201).json(accommodation);
};

export const addAccommodationToCity = async (req, res) => {
  const {
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
  } = req.body;
  const newAccommodation = await accommodationService.addAccommodationToCity(
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
  );
  return res.status(200).json(newAccommodation);
};

export const getAccommodations = async (req, res) => {
  const accommodations = await accommodationService.getAccommodations();
  return res.status(200).json(accommodations);
};

export const getAccommodationById = async (req, res) => {
  const { accommodationId } = req.params;
  const accommodation = await accommodationService
    .getAccommodationById(accommodationId)
    .populate({ path: 'reviews' });
  return res.status(200).json(accommodation);
};

export const getAccommodationsByCity = async (req, res) => {
  const { cityId } = req.params;
  const accommodations =
    await accommodationService.getAccommodationsByCity(cityId);
  return res.status(200).json(accommodations);
};

export const removeAccommodationById = async (req, res) => {
  const { accommodationId } = req.params;
  const result =
    await accommodationService.removeAccommodationById(accommodationId);
  return res
    .status(200)
    .json({ message: 'Accommodation removed successfully' });
};

export const updateAccommodation = async (req, res) => {
  const { accommodationId } = req.params;
  const updatedData = req.body;
  const updatedAccommodation = await accommodationService.updateAccommodation(
    accommodationId,
    updatedData,
  );
  return res.status(200).json(updatedAccommodation);
};

export const filterAccommodationsByCountry = async (req, res) => {
  try {
    const { countryName } = req.params;

    const accommodations =
      await accommodationService.filterAccommodationsByCountry(countryName);

    return res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error filtering accommodations by country:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
