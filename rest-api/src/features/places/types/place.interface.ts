export interface IPlace {
  title: string;
  address: string;
  description: string;
  location: {
    type: 'Point'; // GeoJSON type
    coordinates: [number, number];
  };
  abstract?: string;
  email?: string;
  socialMediaHandles?: Record<string, string>;
  featuredImageUrl?: string;
  updated_at?: Date;
}
