import Country from '../models/country.js';

export const getCountries = async () => {
  const countries = await Country.find();
  return { countries };
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
