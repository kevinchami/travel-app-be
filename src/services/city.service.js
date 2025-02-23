import City from '../models/city.js';
import diacritics from 'diacritics';

export const getCities = async () => {
  const cities = await City.find().populate('country');
  return cities;
};

export const getCitiesByCountry = async countryId => {
  const cities = await City.find({ country: countryId });
  return cities;
};

export const getCityById = async cityId => {
  const city = await City.findById(cityId);
  return city;
};


export const updateCityById = async (cityId, updatedData) => {
  const updatedCity = await City.findByIdAndUpdate(cityId, updatedData, {
    new: true,
  });
  return updatedCity;
};

export const addCityToCountry = async (
  countryId,
  cityName,
  cityDescription,
  cityTours,
  cityTemples,
  cityRestaurants,
  cityAccommodations,
) => {
  const newCity = await City.create({
    name: cityName,
    description: cityDescription,
    tours: cityTours,
    temples: cityTemples,
    restaurants: cityRestaurants,
    accommodations: cityAccommodations,
    country: countryId,
  });
  return newCity;
};

export const removeCityFromCountry = async (countryId, cityId) => {
  const city = await City.findOneAndDelete({ _id: cityId, country: countryId });
  return city;
};

export const getCityIdByName = async cityName => {
  const normalizedCityName = diacritics.remove(cityName.toLowerCase()); // 🔥 Normaliza eliminando tildes y convirtiendo a minúsculas

  const city = await City.findOne({
    name: {
      $regex: `^${normalizedCityName}$`,
      $options: 'i' // 🔍 Ignora mayúsculas/minúsculas
    }
  });
  // console.log('e', city);
  
  return city ? city._id : null;
};

