// services/audiusCache.js

const cache = {};

export const getCachedAudiusTrack = (key) => {
  return cache[key];
};

export const setCachedAudiusTrack = (key, data) => {
  cache[key] = data;
};
