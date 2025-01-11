import { Document, Model, Types } from 'mongoose';

interface IGroup {
  name: string;
  description?: string;
  members: Types.ObjectId[]; // Use Types.ObjectId for references
  createdBy: Types.ObjectId; // Use Types.ObjectId for the creator reference
  createdAt?: Date;
  updatedAt?: Date;
}

interface IGroupDocument extends IGroup, Document {
  addMember(userId: Types.ObjectId): Promise<void>;
  removeMember(userId: Types.ObjectId): Promise<void>;
}

interface IGroupModel extends Model<IGroupDocument> {
  findByMember(userId: Types.ObjectId): Promise<IGroupDocument[]>;
  findByOwner(userId: Types.ObjectId): Promise<IGroupDocument[]>;
}

export type { IGroup, IGroupDocument, IGroupModel };
