// services/driverService.js

import Driver from '../models/driver.js';

export const addDriver = async driverData => {
  const driver = await Driver.create(driverData);
  if (!driver) {
    throw new Error('Failed to add driver');
  }
  return driver;
};

export const getDrivers = async () => {
  const drivers = await Driver.find();
  if (!drivers) {
    throw new Error('Failed to fetch drivers');
  }
  return drivers;
};

export const getDriverById = async driverId => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }
  return driver;
};

export const removeDriverById = async driverId => {
  const result = await Driver.findByIdAndDelete(driverId);
  if (!result) {
    throw new Error('Failed to remove driver');
  }
};

export const getDriversByCity = async cityId => {
  const drivers = await Driver.find({ city: cityId });
  if (!drivers) {
    throw new Error('Failed to fetch drivers by city');
  }
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
