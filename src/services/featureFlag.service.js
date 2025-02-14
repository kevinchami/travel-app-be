import FeatureFlag from '../models/featureFlag.js';

export const getFeatureFlag = async (featureName) => {
  const featureFlag = await FeatureFlag.findOne({ featureName });
  return featureFlag ? featureFlag.enabled : null;
};

export const updateFeatureFlag = async (featureName, enabled) => {
  const updatedFlag = await FeatureFlag.findOneAndUpdate(
    { featureName },
    { enabled },
    { new: true, upsert: true } // Crea la flag si no existe
  );
  return updatedFlag;
};
