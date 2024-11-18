import { IPlace } from './place.interface';
import { Document } from 'mongoose';

export interface ISpot extends IPlace {}

export interface ISpotDocument extends ISpot, Document {}
