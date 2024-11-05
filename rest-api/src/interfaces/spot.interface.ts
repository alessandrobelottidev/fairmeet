export interface SpotDTO {
  title: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  abstract?: string;
  email?: string;
  socialMediaHandles?: Record<string, string>;
  featuredImageUrl?: string;
  updated_at?: Date;
}

// Create an interface that extends both ISpot and Document
// so that the instances of this interface will know which
// parameters are available.
export interface SpotDocument extends SpotDTO, Document {
  // You can add additional methods here if needed
  // For example: getFullAddress(): string;
}

// TODO: REMOVE THE COMMENTS BELOW
// Per michela e marco, creiamo ISpotDocument per questi benefit:

// TypeScript now knows exactly what properties are available
// const spot = new Spot({
//   title: "My Spot",  // Required
//   address: "123 Main St",  // Required
//   // ... other properties
// });

// // These are now type-safe:
// spot.title;  // TypeScript knows this is a string
// spot._id;    // TypeScript knows this is an ObjectId
// spot.save(); // TypeScript knows this is a Promise
