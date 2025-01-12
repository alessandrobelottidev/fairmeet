import type { IMeetingDocument, IMeetingModel } from '@features/meetings/types/meeting.interface';
import mongoose, { Schema } from 'mongoose';

const MeetingSchema = new Schema<IMeetingDocument, IMeetingModel>({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  places: [
    {
      placeId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      placeType: {
        type: String,
        enum: ['spot', 'event'],
        required: true,
      },
    },
  ],
  votes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      selectedPlaces: [
        {
          type: Schema.Types.ObjectId,
          required: true,
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  chosenPlace: {
    placeId: {
      type: Schema.Types.ObjectId,
    },
    placeType: {
      type: String,
      enum: ['spot', 'event'],
    },
  },
  radius: {
    center: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    sizeInMeters: {
      type: Number,
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
MeetingSchema.index({ group: 1 });
MeetingSchema.index({ creator: 1 });
MeetingSchema.index({ 'radius.center': '2dsphere' });

// Methods
MeetingSchema.methods.addVote = async function (
  userId: mongoose.Types.ObjectId,
  selectedPlaces: mongoose.Types.ObjectId[],
): Promise<void> {
  // Check if user has already voted
  if (
    this.votes.some((vote: { userId: { equals: (arg0: mongoose.Types.ObjectId) => any } }) =>
      vote.userId.equals(userId),
    )
  ) {
    throw new Error('User has already voted');
  }

  // Validate selected places exist in meeting places
  const validPlaceIds = this.places.map((place: any) => place.placeId.toString());
  const areValidPlaces = selectedPlaces.every((placeId) =>
    validPlaceIds.includes(placeId.toString()),
  );

  if (!areValidPlaces) {
    throw new Error('Invalid place selection');
  }

  this.votes.push({
    userId,
    selectedPlaces,
    createdAt: new Date(),
  });

  await this.save();
};

MeetingSchema.methods.finalizePlace = async function (
  placeId: mongoose.Types.ObjectId,
  placeType: 'spot' | 'event',
): Promise<void> {
  // Ensure the place exists in the meeting's places
  const placeExists = this.places.some(
    (place: any) => place.placeId.equals(placeId) && place.placeType === placeType,
  );

  if (!placeExists) {
    throw new Error('Invalid place selection');
  }

  this.chosenPlace = { placeId, placeType };
  await this.save();
};

// Statics
MeetingSchema.statics.findByGroup = async function (
  groupId: mongoose.Types.ObjectId,
): Promise<IMeetingDocument[]> {
  return this.find({ group: groupId }).populate('creator').sort({ createdAt: -1 });
};

MeetingSchema.statics.findByCreator = async function (
  userId: mongoose.Types.ObjectId,
): Promise<IMeetingDocument[]> {
  return this.find({ creator: userId }).populate('group').sort({ createdAt: -1 });
};

const MeetingModel = mongoose.model<IMeetingDocument, IMeetingModel>('Meeting', MeetingSchema);

export default MeetingModel;
