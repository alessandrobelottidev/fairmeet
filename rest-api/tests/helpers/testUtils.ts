import UserModel from '../../src/features/auth/models/user';
import { Role } from '../../src/features/auth/types/role';
import GroupModel from '../../src/features/groups/models/group';
import mongoose from 'mongoose';

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    handle: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: Role.BASIC,
  };

  return await UserModel.create({ ...defaultUser, ...overrides });
};

export const createTestGroup = async (createdBy: mongoose.Types.ObjectId, overrides = {}) => {
  const defaultGroup = {
    name: 'Test Group',
    description: 'Test Description',
    members: [createdBy],
    createdBy,
  };

  return await GroupModel.create({ ...defaultGroup, ...overrides });
};
