function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeCoordinates(input = {}) {
  const lat = toNumber(input.lat ?? input.latitude);
  const lng = toNumber(input.lng ?? input.longitude);

  if (lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    type: 'Point',
    coordinates: [lng, lat],
    lat,
    lng,
    accuracy: toNumber(input.accuracy),
    source: input.source || 'browser',
    capturedAt: input.capturedAt ? new Date(input.capturedAt) : new Date()
  };
}

function coordinatesFromGeoLocation(geoLocation) {
  const coordinates = geoLocation?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  const [lng, lat] = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
}

function haversineDistanceKm(from, to) {
  if (!from || !to) return null;

  const earthRadiusKm = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = {
  normalizeCoordinates,
  coordinatesFromGeoLocation,
  haversineDistanceKm
};
