import { placeService } from '../services/index.js';

export const getNearbyPlaces = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, types } = req.body;
    console.log('latitude: ', latitude);
    console.log('longitude: ', longitude);

    if (!latitude || !longitude || !types || !Array.isArray(types)) {
      return res
        .status(400)
        .json({
          error: 'Latitude, longitude, and an array of types are required.',
        });
    }

    const places = await placeService.getNearbyPlaces({
      latitude,
      longitude,
      maxDistance,
      types,
    });
    return res.status(200).json(places);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getKosherNearbyPlaces = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, types } = req.body;

    if (!latitude || !longitude || !types || !Array.isArray(types)) {
      return res
        .status(400)
        .json({
          error: 'Latitude, longitude, and an array of types are required.',
        });
    }

    const places = await placeService.getNearbyKosherPlaces({
      latitude,
      longitude,
      maxDistance,
      types,
    });
    return res.status(200).json(places);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
