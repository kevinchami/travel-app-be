import Accomodation from '../models/accomodation.js';
import Activity from '../models/activity.js';
import Cafe from '../models/cafe.js';
import Driver from '../models/driver.js';
import Must from '../models/must.js';
import Party from '../models/party.js';
import Restaurant from '../models/restaurant.js';
import Temple from '../models/temple.js';
import Tour from '../models/tour.js';

const modelMapping = {
  cafe: Cafe,
  restaurant: Restaurant,
  accommodation: Accomodation,
  driver: Driver,
  must: Must,
  party: Party,
  temple: Temple,
  tour: Tour,
  activity: Activity,
};

export const getNearbyPlaces = async ({
  latitude,
  longitude,
  maxDistance = 5,
  types,
  filters = {},
}) => {
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (!Array.isArray(types) || types.length === 0) {
    throw new Error('At least one valid type must be provided.');
  }

  const models = types.map(type => {
    const Model = modelMapping[type];
    if (!Model) {
      throw new Error(`Invalid type: ${type}`);
    }
    return Model;
  });

  let allPlaces = [];
  for (const Model of models) {
    const places = await Model.find(filters); // Aplicar filtros adicionales
    allPlaces = allPlaces.concat(
      places.map(place => {
        const distance = haversine(
          latitude,
          longitude,
          place.coordinates.latitude,
          place.coordinates.longitude,
        );
        return { ...place.toObject(), distance };
      }),
    );
  }

  const nearbyPlaces = allPlaces
    .filter(place => place.distance <= maxDistance) // Filtrar por distancia
    .sort((a, b) => a.distance - b.distance) // Ordenar por distancia
    .slice(0, 20);
  return nearbyPlaces;
};

export const getNearbyKosherPlaces = async params => {
  return getNearbyPlaces({ ...params, filters: { kosherBoolean: true } });
};
