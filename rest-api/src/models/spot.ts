import { SpotDocument } from '@interfaces/spot.interface';
import mongoose from 'mongoose';

const spotSchema = new mongoose.Schema<SpotDocument>({
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
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90'],
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180'],
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

spotSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<SpotDocument>('spot', spotSchema);
