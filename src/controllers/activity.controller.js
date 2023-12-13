// controllers/activityController.js

import { activityService } from '../services/index.js';

export const addActivity = async (req, res) => {
  try {
    const activity = await activityService.addActivity(req.body);
    return res.status(201).json(activity);
  } catch (error) {
    throw new Error('Failed to add activity');
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await activityService.getActivities();
    return res.status(200).json(activities);
  } catch (error) {
    throw new Error('Failed to fetch activities');
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await activityService.getActivityById(activityId);
    return res.status(200).json(activity);
  } catch (error) {
    throw new Error('Activity not found');
  }
};

export const removeActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    const result = await activityService.removeActivityById(activityId);
    return res.status(200).json({ message: 'Activity removed successfully' });
  } catch (error) {
    throw new Error('Failed to remove activity');
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const updatedData = req.body;
    const updatedActivity = await activityService.updateActivity(
      activityId,
      updatedData,
    );
    return res.status(200).json(updatedActivity);
  } catch (error) {
    throw new Error('Failed to update activity');
  }
};

export const getActivitiesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const activities = await activityService.getActivitiesByCity(cityId);
    return res.status(200).json(activities);
  } catch (error) {
    throw new Error('Failed to fetch activities by city');
  }
};
