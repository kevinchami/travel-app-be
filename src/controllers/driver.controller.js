// controllers/driverController.js

import { driverService } from '../services/index.js';

export const addDriver = async (req, res) => {
  const driver = await driverService.addDriver(req.body);
  return res.status(201).json(driver);
};

export const getDrivers = async (req, res) => {
  const { includeHidden } = req.query;
  const drivers = await driverService.getDrivers(includeHidden);
  return res.status(200).json(drivers);
};

export const getDriverById = async (req, res) => {
  const { driverId } = req.params;
  const { includeHidden } = req.query;
  const driver = await driverService.getDriverById(driverId, includeHidden);
  return res.status(200).json(driver);
};

export const getDriversByCity = async (req, res) => {
  const { cityId } = req.params;
  const { includeHidden } = req.query;
  const drivers = await driverService.getDriversByCity(cityId, includeHidden);
  return res.status(200).json(drivers);
};

export const removeDriverById = async (req, res) => {
  const { driverId } = req.params;
  await driverService.removeDriverById(driverId);
  return res.status(200).json({ message: 'Driver removed successfully' });
};

export const updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const updatedData = req.body;
  const updatedDriver = await driverService.updateDriver(driverId, updatedData);
  return res.status(200).json(updatedDriver);
};
