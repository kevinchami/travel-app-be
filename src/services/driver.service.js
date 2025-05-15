// services/driverService.js

import Driver from '../models/driver.js';

export const addDriver = async driverData => {
  const driver = await Driver.create(driverData);
  if (!driver) {
    throw new Error('Failed to add driver');
  }
  return driver;
};

export const getDrivers = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const drivers = await Driver.find({}, null, options);
  if (!drivers) throw new Error('Failed to fetch drivers');
  return drivers;
};

export const getDriverById = async (driverId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const driver = await Driver.findById(driverId, null, options);
  if (!driver) throw new Error('Driver not found');
  return driver;
};

export const removeDriverById = async driverId => {
  const result = await Driver.findByIdAndDelete(driverId);
  if (!result) {
    throw new Error('Failed to remove driver');
  }
};

export const getDriversByCity = async (cityId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const drivers = await Driver.find({ city: cityId }, null, options);
  if (!drivers) throw new Error('Failed to fetch drivers by city');
  return drivers;
};

export const updateDriver = async (driverId, updatedData) => {
  const updatedDriver = await Driver.findByIdAndUpdate(driverId, updatedData, {
    new: true,
  });
  if (!updatedDriver) {
    throw new Error('Driver not found');
  }
  return updatedDriver;
};
