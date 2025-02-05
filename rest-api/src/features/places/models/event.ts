import { IEventDocument } from '@features/places/types/event.interface';
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema<IEventDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  location: {
    type: {
      type: 'String', // GeoJSON type
      enum: ['Point'], // Must be "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  startDateTimeZ: {
    type: Date,
    required: true,
  },
  endDateTimeZ: {
    type: Date,
    required: true,
  },
  abstract: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email',
    },
  },
  socialMediaHandles: {
    type: Map,
    of: String,
  },
  featuredImageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v: string) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Please enter a valid URL',
    },
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

eventSchema.index({ location: '2dsphere' });

export default mongoose.model<IEventDocument>('event', eventSchema);
