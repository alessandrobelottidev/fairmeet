import { IEvent } from './event.interface';
import { Document } from 'mongoose';

export interface IPlace {
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
