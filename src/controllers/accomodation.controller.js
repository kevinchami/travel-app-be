import { accommodationService } from '../services/index.js';
import {
  getDetailsInItems,
  getTypesInItems,
} from '../services/search.service.js';

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
  const { includeHidden } = req.query;
  const accommodations =
    await accommodationService.getAccommodations(includeHidden);
  return res.status(200).json(accommodations);
};

export const getAccommodationById = async (req, res) => {
  const { accommodationId } = req.params;
  const { includeHidden } = req.query;
  const accommodation = await accommodationService.getAccommodationById(
    accommodationId,
    includeHidden,
  );
  return res.status(200).json(accommodation);
};

// export const getAccommodationsByCity = async (req, res) => {
//   const { cityId } = req.params;
//   const { includeHidden } = req.query;
//   const accommodations = await accommodationService.getAccommodationsByCity(
//     cityId,
//     includeHidden,
//   );
//   return res.status(200).json(accommodations);
// };
export const getAccommodationsByCity = async (req, res) => {
  const { cityId } = req.params;
  const { includeHidden, returnTypesFromItems } = req.query;

  const accommodations = await accommodationService.getAccommodationsByCity(
    cityId,
    includeHidden,
  );

  if (returnTypesFromItems === 'true') {
    const types = getTypesInItems(accommodations);
    const details = getDetailsInItems(accommodations);
    return res.status(200).json({ accommodations, types, details });
  }

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
  const { countryName } = req.params;
  const { includeHidden } = req.query;

  try {
    const accommodations =
      await accommodationService.filterAccommodationsByCountry(
        countryName,
        includeHidden,
      );
    return res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error filtering accommodations by country:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const filterHighlightAccommodationsByCountry = async (req, res) => {
  const { countryName } = req.params;
  const { includeHidden } = req.query;

  try {
    const accommodations =
      await accommodationService.filterHighlightAccommodationsByCountry(
        countryName,
        includeHidden,
      );
    return res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error filtering accommodations by country:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const filterHighlightAccommodationsByCity = async (req, res) => {
  const { cityId } = req.params;
  const { includeHidden } = req.query;

  try {
    const accommodations =
      await accommodationService.filterHighlightAccommodationsByCity(
        cityId,
        includeHidden,
      );
    return res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error filtering highlighted accommodations by city:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllAccommodationDetails = async (req, res) => {
  try {
    const details = await accommodationService.getAllAccommodationDetails();
    return res.status(200).json(details);
  } catch (error) {
    console.error('Error fetching accommodation details list:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
