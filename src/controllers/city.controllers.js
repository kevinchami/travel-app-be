import { cityService } from '../services/index.js';

export const getCities = async (req, res) => {
  const cities = await cityService.getCities();
  return res.status(200).json(cities);
};

export const getCitiesByCountry = async (req, res) => {
  const { countryId } = req.params; // Assuming the country ID is provided in the URL params
  const cities = await cityService.getCitiesByCountry(countryId);
  return res.status(200).json(cities);
};

export const getCityById = async (req, res) => {
  const { cityId } = req.params;
  const city = await cityService.getCityById(cityId);
  if (!city) {
    throw new Error('City not found');
  }
  return res.status(200).json(city);
};

export const getCityIdByName = async (req, res) => {
  const { cityName } = req.params; // Obtener el nombre de la ciudad desde los parámetros de la URL

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  const cityId = await cityService.getCityIdByName(cityName);

  if (!cityId) {
    return res.status(404).json({ error: 'City not found' });
  }

  console.log('city id', cityId);
  

  return res.status(200).json({ cityId });
};


export const updateCity = async (req, res) => {
  const { cityId } = req.params;
  const updatedData = req.body; // Assuming the updated data is sent in the request body
  const updatedCity = await cityService.updateCityById(cityId, updatedData);
  if (!updatedCity) {
    throw new Error('City not found');
  }
  return res.status(200).json(updatedCity);
};

export const addCityToCountry = async (req, res) => {
  const {
    countryId,
    cityName,
    cityDescription,
    cityTours,
    cityTemples,
    cityRestaurants,
    cityAccommodations,
  } = req.body;
  const newCity = await cityService.addCityToCountry(
    countryId,
    cityName,
    cityDescription,
    cityTours,
    cityTemples,
    cityRestaurants,
    cityAccommodations,
  );
  return res.status(200).json(newCity);
};

export const removeCityFromCountry = async (req, res) => {
  const { countryId, cityId } = req.body;
  const removedCity = await cityService.removeCityFromCountry(
    countryId,
    cityId,
  );
  if (!removedCity) {
    throw new Error('City not found in the country');
  }
  return res.status(200).json(removedCity);
};
