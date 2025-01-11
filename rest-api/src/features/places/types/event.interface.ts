import { IPlace } from './place.interface';
import { Document } from 'mongoose';

export interface IEvent extends IPlace {
  startDateTimeZ: Date;
  endDateTimeZ: Date;
}

export interface IEventDocument extends IEvent, Document {}
