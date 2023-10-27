import { countryService } from '../services/index.js';

export const getCountries = (_, res) => {
  const countries = countryService.getCountries();
  return res.status(200).json(countries);
};

export const createCountry = (_, res) => {
  const country = countryService.createCountry();
  return res.status(200).json(country);
};
