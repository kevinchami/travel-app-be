import { countryService } from '../services/index.js';

export const getCountries = (_, res) => {
  try {
    const countries = countryService.getCountries();
    return res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error getting countries' });
  }
};

export const createCountry = (_, res) => {
  try {
    const country = countryService.createCountry();
    return res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: 'Error creating a country' });
  }
};
