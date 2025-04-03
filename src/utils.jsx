// utils.js
export function calculateDistance(pos1, pos2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (pos2[0] - pos1.lat) * Math.PI / 180;
    const dLon = (pos2[1] - pos1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }