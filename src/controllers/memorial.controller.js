import { memorialService } from '../services/index.js';

// Add new temple
export const addPerson = async (req, res) => {
  const person = await memorialService.addPerson(req.body);
  return res.status(201).json(person);
};

// Get all temples
export const getPeople = async (req, res) => {
  const people = await memorialService.getPeople();
  return res.status(200).json(people);
};

// Remove person
export const removePerson = async (req, res) => {
  const personId = req.params.id;
  try {
    const removedPerson = await memorialService.removePerson(personId);
    return res.status(200).json(removedPerson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update person
export const updatePerson = async (req, res) => {
  const personId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedPerson = await memorialService.updatePerson(
      personId,
      updatedData,
    );
    return res.status(200).json(updatedPerson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
