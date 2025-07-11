import Country from '../models/country.js';

export const getCountries = async () => {
  const availableCountries = await Country.find({ available: true })
    .populate({
      path: 'cities',
      select: 'name description',
    })
    .sort({ name: 1 });

  const unavailableCountries = await Country.find({ available: false })
    .populate({
      path: 'cities',
      select: 'name description',
    })
    .sort({ name: 1 });

  return [...availableCountries, ...unavailableCountries]; // ✅ solo retorno data
};
// export const getCountries = async () => {
//   // Agregamos .sort para ordenar por 'priority'
//   const countries = await Country.find()
//     .populate({
//       path: 'cities',
//       select: 'name description',
//     })
//     .sort({ priority: 1 }); // 1 para orden ascendente, -1 para descendente

//   return countries;
// };

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

export const getCountryIdByName = async countryName => {
  const country = await Country.findOne({ name: countryName });
  return country ? country._id : null;
};
