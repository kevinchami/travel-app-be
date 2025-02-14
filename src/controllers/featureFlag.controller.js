import { getFeatureFlag, updateFeatureFlag } from '../services/featureFlag.service.js';

export const fetchFeatureFlag = async (req, res) => {
  const { featureName } = req.params;

  try {
    const isEnabled = await getFeatureFlag(featureName);

    if (isEnabled === null) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }

    res.status(200).json({ enabled: isEnabled });
  } catch (error) {
    console.error('Error fetching feature flag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const toggleFeatureFlag = async (req, res) => {
  const { featureName } = req.params;
  const { enabled } = req.body;

  try {
    const updatedFlag = await updateFeatureFlag(featureName, enabled);
    res.status(200).json(updatedFlag);
  } catch (error) {
    console.error('Error updating feature flag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
