import Country from '../models/country.js';
import Party from '../models/party.js';

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
