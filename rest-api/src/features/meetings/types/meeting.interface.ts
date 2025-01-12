import { Document, Model, Types } from 'mongoose';

interface IMeeting {
  group: Types.ObjectId;
  creator: Types.ObjectId;
  places: Array<{
    placeId: Types.ObjectId;
    placeType: 'spot' | 'event';
  }>;
  votes: Array<{
    userId: Types.ObjectId;
    selectedPlaces: Types.ObjectId[];
    createdAt: Date;
  }>;
  chosenPlace?: {
    placeId: Types.ObjectId;
    placeType: 'spot' | 'event';
  };
  radius: {
    center: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    sizeInMeters: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface IMeetingDocument extends IMeeting, Document {
  addVote(userId: Types.ObjectId, selectedPlaces: Types.ObjectId[]): Promise<void>;
  finalizePlace(placeId: Types.ObjectId, placeType: 'spot' | 'event'): Promise<void>;
}

interface IMeetingModel extends Model<IMeetingDocument> {
  findByGroup(groupId: Types.ObjectId): Promise<IMeetingDocument[]>;
  findByCreator(userId: Types.ObjectId): Promise<IMeetingDocument[]>;
}

export type { IMeeting, IMeetingDocument, IMeetingModel };
