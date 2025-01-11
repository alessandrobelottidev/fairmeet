import type { IMessageDocument, IMessageModel } from '@features/groups/types/message.interface';
import mongoose, { Schema } from 'mongoose';

export const MessageSchema = new Schema<IMessageDocument, IMessageModel>({
  content: { type: String, required: true, trim: true },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Index the group field in MessageSchema for efficient message retrieval
MessageSchema.index({ group: 1, createdAt: -1 });

MessageSchema.statics.findByGroup = async function (
  groupId: mongoose.Types.ObjectId,
  limit: number = 50,
  skip: number = 0,
): Promise<IMessageDocument[]> {
  return this.find({ group: groupId })
    .sort({ createdAt: -1 }) // Sort by most recent messages
    .skip(skip)
    .limit(limit)
    .populate('sender');
};

const GroupModel = mongoose.model<IMessageDocument, IMessageModel>('Message', MessageSchema);

export default GroupModel;
