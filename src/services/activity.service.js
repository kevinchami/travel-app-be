// services/activityService.js

import Activity from '../models/activity.js';

// Add an activity
export const addActivity = async activityData => {
  const activity = await Activity.create(activityData);
  if (!activity) {
    throw new Error('Failed to add activity');
  }
  return activity;
};

// Get all activities
export const getActivities = async () => {
  const activities = await Activity.find();
  return activities;
};

// Get an activity by ID
export const getActivityById = async activityId => {
  const activity = await Activity.findById(activityId);
  if (!activity) {
    throw new Error('Activity not found');
  }
  return activity;
};

// Remove an activity by ID
export const removeActivityById = async activityId => {
  const result = await Activity.findByIdAndRemove(activityId);
  if (!result) {
    throw new Error('Failed to remove activity');
  }
  return result;
};

// Update an activity
export const updateActivity = async (activityId, updatedData) => {
  const updatedActivity = await Activity.findByIdAndUpdate(
    activityId,
    updatedData,
    {
      new: true,
    },
  );
  if (!updatedActivity) {
    throw new Error('Failed to update activity');
  }
  return updatedActivity;
};

// Get activities by city
export const getActivitiesByCity = async cityId => {
  const activities = await Activity.find({ city: cityId });
  if (!activities) {
    throw new Error('Failed to fetch activities by city');
  }
  return activities;
};
