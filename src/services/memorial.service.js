import Memorial from '../models/memorial.js';

// Add new person
export const addPerson = async personData => {
  const person = await Memorial.create(personData);
  if (!person) {
    throw new Error('Failed to add person');
  }
  return person;
};

// Get all people
export const getPeople = async () => {
  const people = await Memorial.find();
  if (!people) {
    throw new Error('Failed to fetch people');
  }
  return people;
};

// Remove person (Newly added function)
export const removePerson = async personId => {
  try {
    const removedPerson = await Memorial.findByIdAndDelete(personId);
    if (!removedPerson) {
      throw new Error('Person not found');
    }
    return removedPerson;
  } catch (error) {
    throw new Error('Failed to remove person');
  }
};

// Update person (Newly added function)
export const updatePerson = async (personId, updatedData) => {
  try {
    const updatedPerson = await Memorial.findByIdAndUpdate(
      personId,
      updatedData,
      { new: true },
    );
    if (!updatedPerson) {
      throw new Error('Person not found');
    }
    return updatedPerson;
  } catch (error) {
    throw new Error('Failed to update person');
  }
};
