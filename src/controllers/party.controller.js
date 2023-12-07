import { partyService } from '../services/index.js';

export const addParty = async (req, res) => {
  const party = await partyService.addParty(req.body);
  return res.status(201).json(party);
};

export const getParties = async (req, res) => {
  const parties = await partyService.getParties();
  return res.status(200).json(parties);
};

export const getPartyById = async (req, res) => {
  const { partyId } = req.params;
  const party = await partyService.getPartyById(partyId);
  return res.status(200).json(party);
};

export const removePartyById = async (req, res) => {
  const { partyId } = req.params;
  const result = await partyService.removePartyById(partyId);
  return res.status(200).json({ message: 'Party removed successfully' });
};

export const getPartiesByCity = async (req, res) => {
  const { cityId } = req.params;
  const parties = await partyService.getPartiesByCity(cityId);
  return res.status(200).json(parties);
};

export const updateParty = async (req, res) => {
  const { partyId } = req.params;
  const updatedData = req.body;
  const updatedParty = await partyService.updateParty(partyId, updatedData);
  return res.status(200).json(updatedParty);
};
