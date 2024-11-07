import { Document } from 'mongoose';

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

export interface SpotDocument extends SpotDTO, Document {}
