/**
 * Approximately 111 km corresponds to 1 degree, thus 1 meter corresponds to approximately 1/111000 degrees.
 */
export const DEG_PER_METER = 111000;

/**
 * Converts a target coordinate to an diff based on a reference center coordinate.
 * Useful for creating a grid diff system for spatial data.
 *
 * @param {Object} center - The reference coordinate with latitude and longitude.
 * @param {Object} target - The target coordinate to convert into diff form.
 * @param {number} precisionMeters - The precision, in meters, for the conversion.
 * @param {number} degreePerMeter - Conversion factor from meters to degrees. Default is 111000.
 * @returns {Object} The calculated diff for latitude and longitude.
 */
export function calculateCoordinateDiff({
  center,
  target,
  precisionMeters = 3,
  degreePerMeter = DEG_PER_METER,
}: {
  center: { lat: number; lng: number };
  target: { lat: number; lng: number };
  precisionMeters?: number;
  degreePerMeter?: number;
}): { lat: number; lng: number } {
  // Convert latitude difference from degrees to meters.
  const latDiff = (target.lat - center.lat) * degreePerMeter;

  // Convert longitude difference from degrees to meters, adjusting for latitude.
  const lngDiff =
    (target.lng - center.lng) *
    degreePerMeter *
    Math.cos((center.lat * Math.PI) / 180);

  // Calculate index by dividing the meter difference by the specified precision.
  return {
    lat: Math.round(latDiff / precisionMeters),
    lng: Math.round(lngDiff / precisionMeters),
  };
}

/**
 * Converts a grid diff back into a coordinate based on a reference center coordinate.
 * This reverses the operation done by `calculateCoordinateDiff`.
 *
 * @param {Object} center - The reference coordinate with latitude and longitude.
 * @param {Object} diff - The grid diff representing the position related to the center.
 * @param {number} precisionMeters - The precision, in meters, used in the conversion process.
 * @param {number} degreePerMeter - Conversion factor from meters to degrees. Default is 111000.
 * @returns {Object} The calculated target coordinate.
 */
export function reconstructCoordinateDiff({
  center,
  diff,
  precisionMeters = 3,
  degreePerMeter = DEG_PER_METER,
}: {
  center: { lat: number; lng: number };
  diff: { lat: number; lng: number };
  precisionMeters?: number;
  degreePerMeter?: number;
}): { lat: number; lng: number } {
  // Convert the latitude index back to degrees difference.
  const latDiff = (diff.lat * precisionMeters) / degreePerMeter;

  // Convert the longitude index back to degrees difference, adjusting for latitude.
  const lngDiff =
    (diff.lng * precisionMeters) /
    (degreePerMeter * Math.cos((center.lat * Math.PI) / 180));

  // Add the differences to the center coordinates to get the target coordinates.
  const targetLat = center.lat + latDiff;
  const targetLng = center.lng + lngDiff;

  return { lat: targetLat, lng: targetLng };
}
