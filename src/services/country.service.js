import Country from '../models/country.js';

export const getCountries = async () => {
  const countries = await Country.find();

  return { countries };
};

export const createCountry = async () => {
  const country = await Country.create({
    name: 'Falso',
    description: 'Falso country',
  });

  return { country };
};
