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

export const getParties = async () => {
  const parties = await Party.find();
  if (!parties) {
    throw new Error('Failed to fetch parties');
  }
  return parties;
};

export const getPartyById = async partyId => {
  const party = await Party.findById(partyId);
  if (!party) {
    throw new Error('Party not found');
  }
  return party;
};

export const getPartiesByCity = async cityId => {
  const parties = await Party.find({ city: cityId });
  if (!parties) {
    throw new Error('Failed to fetch parties by city');
  }
  return parties;
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

export const getHighlightedPartiesByCountry = async countryName => {
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    throw new Error('Country not found');
  }

  const parties = await Party.find({
    countryId: country._id.toString(), // Asegúrate de que la comparación sea con un String
    highlighted: true,
  }).sort({ priority: 1 });

  return parties;
};

export const searchParties = async (query, top_k = 20, detectedCity = null) => {
  const pipeline = await buildVectorSearchPipeline(query, 'party_vector_index', top_k);
  if (!pipeline) return [];

  const lowerQuery = query.toLowerCase();

  // 🔥 Detect queries related to nightlife
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

  if (isNightclubQuery) {
    pipeline.push({ $match: { type: 'Nightclub' } });
  }
  if (isBarQuery) {
    pipeline.push({ $match: { type: 'Bar' } });
  }
  if (isFestivalQuery) {
    pipeline.push({ $match: { type: 'Festival' } });
  }
  if (detectedCity) {
    const cityId = await getCityIdByName(detectedCity);
    if (cityId) {
      pipeline.push({ $match: { city: cityId } });
    }
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
