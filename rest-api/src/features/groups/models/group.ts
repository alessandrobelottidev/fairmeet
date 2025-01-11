import type { IGroupDocument, IGroupModel } from '@features/groups/types/group.interface';
import mongoose, { Schema } from 'mongoose';

const GroupSchema = new Schema<IGroupDocument, IGroupModel>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index the members array in GroupSchema to improve findByMember performance
GroupSchema.index({ members: 1 });

GroupSchema.methods.addMember = async function (userId: mongoose.Types.ObjectId): Promise<void> {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    await this.save();
  }
};

GroupSchema.methods.removeMember = async function (userId: mongoose.Types.ObjectId): Promise<void> {
  this.members = this.members.filter((member: any) => !member.equals(userId));
  await this.save();
};

GroupSchema.statics.findByMember = async function (
  userId: mongoose.Types.ObjectId,
): Promise<IGroupDocument[]> {
  return this.find({ members: userId }).populate('members createdBy');
};

GroupSchema.statics.findByOwner = async function (
  userId: mongoose.Types.ObjectId,
): Promise<IGroupDocument[]> {
  return this.find({ createdBy: userId }).populate('members createdBy');
};

const GroupModel = mongoose.model<IGroupDocument, IGroupModel>('Group', GroupSchema);

export default GroupModel;
