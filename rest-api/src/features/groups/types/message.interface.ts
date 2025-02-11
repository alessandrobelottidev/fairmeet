import { Document, Model, Types } from 'mongoose';

interface IMessage {
  content: string;
  sender: Types.ObjectId; // Use Types.ObjectId for the sender
  group: Types.ObjectId; // Use Types.ObjectId for the group
  createdAt?: Date;
}

interface IMessageDocument extends IMessage, Document {}

interface IMessageModel extends Model<IMessageDocument> {
  findByGroup(groupId: Types.ObjectId, limit: number): Promise<IMessageDocument[]>;
}

export type { IMessage, IMessageDocument, IMessageModel };
