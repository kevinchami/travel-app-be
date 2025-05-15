import Country from '../models/country.js';
import Party from '../models/party.js';
import { buildVectorSearchPipeline } from '../utils/searchUtils.js';
import { getCityIdByName } from './city.service.js';

export const addParty = async partyData => {
  const party = await Party.create(partyData);
  if (!party) {
    throw new Error('Failed to add party');
  }
  return party;
};

export const getParties = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Party.find({}, null, options);
};

export const getPartyById = async (partyId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Party.findById(partyId, null, options);
};

export const getPartiesByCity = async (cityId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Party.find({ city: cityId }, null, options);
};

export const removePartyById = async partyId => {
  const result = await Party.findByIdAndDelete(partyId);
  if (!result) {
    throw new Error('Failed to remove party');
  }
  return result;
};

export const updateParty = async (partyId, updatedData) => {
  const updatedParty = await Party.findByIdAndUpdate(partyId, updatedData, {
    new: true,
  });
  if (!updatedParty) {
    throw new Error('Party not found');
  }
  return updatedParty;
};

export const getHighlightedPartiesByCountry = async (
  countryName,
  includeHidden = false,
) => {
  const country = await Country.findOne({ name: countryName });
  if (!country) throw new Error('Country not found');

  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Party.find(
    { countryId: country._id.toString(), highlighted: true },
    null,
    options,
  ).sort({ priority: 1 });
};

export const searchParties = async (
  query,
  top_k = 20,
  detectedCity = null,
  includeHidden = false,
) => {
  const pipeline = await buildVectorSearchPipeline(
    query,
    'party_vector_index',
    top_k,
  );
  if (!pipeline) return [];

  const lowerQuery = query.toLowerCase();

  const isNightclubQuery =
    lowerQuery.includes('nightclub') ||
    lowerQuery.includes('club') ||
    lowerQuery.includes('dj') ||
    lowerQuery.includes('electronic music') ||
    lowerQuery.includes('dance');

  const isBarQuery =
    lowerQuery.includes('bar') ||
    lowerQuery.includes('cocktail') ||
    lowerQuery.includes('pub') ||
    lowerQuery.includes('wine') ||
    lowerQuery.includes('whiskey');

  const isFestivalQuery =
    lowerQuery.includes('festival') ||
    lowerQuery.includes('live music') ||
    lowerQuery.includes('concert') ||
    lowerQuery.includes('event');

  if (isNightclubQuery) pipeline.push({ $match: { type: 'Nightclub' } });
  if (isBarQuery) pipeline.push({ $match: { type: 'Bar' } });
  if (isFestivalQuery) pipeline.push({ $match: { type: 'Festival' } });

  if (detectedCity) {
    const cityId = await getCityIdByName(detectedCity);
    if (cityId) pipeline.push({ $match: { city: cityId } });
  }

  if (includeHidden !== 'true') {
    pipeline.push({ $match: { hide: { $ne: true } } });
  }

  try {
    const results = await Party.aggregate(pipeline);
    console.log(`✅ Se encontraron ${results.length} parties`);
    return results;
  } catch (error) {
    console.error('❌ Error en búsqueda de parties:', error);
    return [];
  }
};
