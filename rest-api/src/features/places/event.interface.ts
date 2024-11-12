import { Document } from 'mongoose';

export interface IEvent {
  title: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  startDateTimeZ: number;
  endDateTimeZ: number;
  abstract?: string;
  email?: string;
  socialMediaHandles?: Record<string, string>;
  featuredImageUrl?: string;
  updated_at?: Date;
}

export interface IEventDocument extends IEvent, Document {}
