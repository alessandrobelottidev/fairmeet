import mongoose from 'mongoose';

export default mongoose.model(
  'event',
  new mongoose.Schema({
    title: String,
    address: String,
    latitude: Number,
    longitude: Number,
    startDateTimeZ: String,
    endDateTimeZ: String,
    description: String,
    updated_at: { type: Date, default: Date.now },
  }),
);
