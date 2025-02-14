import { Schema, model } from 'mongoose';

const featureFlagSchema = new Schema(
  {
    featureName: { type: String, required: true, unique: true },
    enabled: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const FeatureFlag = model('FeatureFlag', featureFlagSchema);

export default FeatureFlag;
