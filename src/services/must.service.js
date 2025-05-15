// services/mustService.js

import Must from '../models/must.js';

export const addMust = async mustData => {
  const must = await Must.create(mustData);
  if (!must) {
    throw new Error('Failed to add must');
  }
  return must;
};

export const getMusts = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const musts = await Must.find({}, null, options);
  if (!musts) throw new Error('Failed to fetch musts');
  return musts;
};

export const getMustById = async (mustId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const must = await Must.findById(mustId, null, options);
  if (!must) throw new Error('Must not found');
  return must;
};

export const removeMustById = async mustId => {
  const result = await Must.findByIdAndDelete(mustId);
  if (!result) {
    throw new Error('Failed to remove must');
  }
};

export const getMustsByCountry = async (countryId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const musts = await Must.find({ countryId }, null, options);
  if (!musts) throw new Error('Failed to fetch musts by country');
  return musts;
};

export const getMustsByCity = async (cityId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const musts = await Must.find({ city: cityId }, null, options);
  if (!musts) throw new Error('Failed to fetch musts by city');
  return musts;
};

export const updateMust = async (mustId, updatedData) => {
  const updatedMust = await Must.findByIdAndUpdate(mustId, updatedData, {
    new: true,
  });
  if (!updatedMust) {
    throw new Error('Must not found');
  }
  return updatedMust;
};

export const getDistinctTypes = async countryId => {
  try {
    // Filtrar por `countryId` si se proporciona
    const filter = countryId ? { countryId } : {};

    // Obtener los tipos de categoría distintos basados en el filtro
    const rawTypes = await Must.distinct('category', filter);
    if (!rawTypes) {
      throw new Error('Failed to fetch distinct types');
    }

    // Dividir y limpiar los tipos, y remover duplicados
    const splitTypes = rawTypes.reduce((acc, typeString) => {
      return acc.concat(typeString.split(',').map(type => type.trim()));
    }, []);
    const distinctTypes = Array.from(new Set(splitTypes));

    return distinctTypes;
  } catch (error) {
    console.error('Error fetching distinct types:', error);
    throw new Error(error.message);
  }
};
