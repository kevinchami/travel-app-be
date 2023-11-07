import Country from '../models/country.js';

export const getCountries = async () => {
  const countries = await Country.find().populate('cities');
  return countries;
};

export const getCountryById = async countryId => {
  const country = await Country.findById(countryId);
  return country;
};

export const createCountry = async (name, description, imageUrl, region) => {
  const country = await Country.create({
    name: name,
    description: description,
    image: {
      url: imageUrl,
      key: 'argentina-image-key',
    },
    region: region,
  });
  return country;
};

export const addCityToCountry = async (countryId, cityName) => {
  const updatedCountry = await Country.findByIdAndUpdate(
    countryId,
    { $push: { cities: { name: cityName } } },
    { new: true }, // { new: true } option is used to return the updated document after the update is applied
  );
  return updatedCountry;
};

export const removeCityFromCountry = async (countryId, cityName) => {
  const updatedCountry = await Country.findByIdAndUpdate(
    countryId,
    { $pull: { cities: { name: cityName } } },
    { new: true },
  );
  return updatedCountry;
};

export const removeCountryById = async countryId => {
  const result = await Country.findOneAndDelete({ _id: countryId });
  return result;
};

export const updateCountryById = async (countryId, updatedData) => {
  const updatedCountry = await Country.findByIdAndUpdate(
    countryId,
    updatedData,
    { new: true },
  );
  return updatedCountry;
};
