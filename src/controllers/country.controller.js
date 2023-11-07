import { countryService } from '../services/index.js';

export const getCountries = async (_, res) => {
  const countries = await countryService.getCountries();
  return res.status(200).json(countries);
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
