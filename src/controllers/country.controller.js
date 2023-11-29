import { countryService } from '../services/index.js';

export const getCountries = async (req, res) => {
  const countries = await countryService.getCountries();
  if (!countries) {
    throw new Error('No Countries Found');
  }
  return res.status(200).json(countries);
};

export const getCountryById = async (req, res) => {
  const { countryId } = req.body;
  const country = await countryService.getCountryById(countryId);
  return res.status(200).json(country);
};

export const createCountry = async (req, res) => {
  const { name, description, imageUrl, region } = req.body;
  const country = await countryService.createCountry(
    name,
    description,
    imageUrl,
    region,
  );
  return res.status(200).json(country);
};

export const addCityToCountry = async (req, res) => {
  const { countryId, cityName } = req.body;
  const updatedCountry = await countryService.addCityToCountry(
    countryId,
    cityName,
  );
  return res.status(200).json(updatedCountry);
};

export const removeCityFromCountry = async (req, res) => {
  const { countryId, cityName } = req.body;
  const updatedCountry = await countryService.removeCityFromCountry(
    countryId,
    cityName,
  );
  if (!updatedCountry) {
    throw new Error('City not found in the country');
  }
  return res.status(200).json(updatedCountry);
};

export const removeCountry = async (req, res) => {
  const { countryId } = req.body;
  const result = await countryService.removeCountryById(countryId);
  if (!result) {
    throw new Error('Country not found');
  }
  return res.status(200).json({ message: 'Country removed successfully' });
};

export const updateCountry = async (req, res) => {
  const { countryId } = req.body;
  const updatedData = req.body; // Assuming the updated data is sent in the request body
  const updatedCountry = await countryService.updateCountryById(
    countryId,
    updatedData,
  );
  if (!updatedCountry) {
    throw new Error('Country not found');
  }
  return res.status(200).json(updatedCountry);
};

export const getCountryIdByName = async (req, res) => {
  const { countryName } = req.params;

  try {
    const countryId = await countryService.getCountryIdByName(countryName);

    if (!countryId) {
      return res.status(404).json({ error: 'Country not found' });
    }

    return res.status(200).json({ countryId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
