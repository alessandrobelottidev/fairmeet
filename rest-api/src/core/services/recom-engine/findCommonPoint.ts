function calculateCentroid(coordinates: number[][]) {
  let x = 0,
    y = 0,
    z = 0;

  coordinates.forEach(([longitude, latitude]) => {
    const latRad = (latitude * Math.PI) / 180; // Convert to radians
    const lonRad = (longitude * Math.PI) / 180; // Convert to radians

    x += Math.cos(latRad) * Math.cos(lonRad);
    y += Math.cos(latRad) * Math.sin(lonRad);
    z += Math.sin(latRad);
  });

  const total = coordinates.length;
  x /= total;
  y /= total;
  z /= total;

  const lon = Math.atan2(y, x) * (180 / Math.PI); // Convert back to degrees
  const hyp = Math.sqrt(x * x + y * y); // Hypotenuse
  const lat = Math.atan2(z, hyp) * (180 / Math.PI); // Convert back to degrees

  return [lon, lat];
}

// // Example usage
// const coordinates = [
//   [-73.935242, 40.73061], // New York
//   [2.352222, 48.856613], // Paris
//   [139.691711, 35.689487], // Tokyo
// ];

// const centroid = calculateCentroid(coordinates);
// console.log('Centroid:', centroid); // Output: [longitude, latitude]
