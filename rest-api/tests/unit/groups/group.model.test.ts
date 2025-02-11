import GroupModel from '../../../src/features/groups/models/group';
import { createTestUser } from '../../helpers/testUtils';
import mongoose from 'mongoose';

describe('Group Model', () => {
  let creator: any;
  let member: any;

  beforeEach(async () => {
    creator = await createTestUser({ handle: 'creator' });
    member = await createTestUser({ handle: 'member', email: 'member@example.com' });
  });

  describe('Group Creation', () => {
    it('should create a group with valid data', async () => {
      const group = await GroupModel.create({
        name: 'Test Group',
        description: 'Test Description',
        members: [creator._id],
        createdBy: creator._id,
      });

      expect(group.name).toBe('Test Group');
      expect(group.description).toBe('Test Description');
      expect(group.members).toHaveLength(1);
      expect(group.members[0]).toEqual(creator._id);
      expect(group.createdBy).toEqual(creator._id);
    });

    it('should require a name', async () => {
      await expect(
        GroupModel.create({
          description: 'Test Description',
          members: [creator._id],
          createdBy: creator._id,
        }),
      ).rejects.toThrow();
    });
  });

  describe('Member Management', () => {
    let group: any;

    beforeEach(async () => {
      group = await GroupModel.create({
        name: 'Test Group',
        description: 'Test Description',
        members: [creator._id],
        createdBy: creator._id,
      });
    });

    it('should add a new member', async () => {
      await group.addMember(member._id);
      expect(group.members).toHaveLength(2);
      expect(group.members.map((id: mongoose.Types.ObjectId) => id.toString()));
    });

    it('should not add duplicate members', async () => {
      await group.addMember(creator._id);
      expect(group.members).toHaveLength(1);
    });

    it('should remove a member', async () => {
      await group.addMember(member._id);
      expect(group.members).toHaveLength(2);

      await group.removeMember(member._id);
      expect(group.members).toHaveLength(1);
      expect(group.members.map((id: mongoose.Types.ObjectId) => id.toString())).not.toContain(
        member._id.toString(),
      );
    });
  });

  describe('Group Queries', () => {
    let group1: any;
    let group2: any;

    beforeEach(async () => {
      group1 = await GroupModel.create({
        name: 'Group 1',
        members: [creator._id],
        createdBy: creator._id,
      });

      group2 = await GroupModel.create({
        name: 'Group 2',
        members: [member._id],
        createdBy: creator._id,
      });
    });

    it('should find groups by member', async () => {
      const groups = await GroupModel.findByMember(creator._id);
      expect(groups).toHaveLength(1);
      expect(groups[0].name).toBe('Group 1');
    });

    it('should find groups by owner', async () => {
      const groups = await GroupModel.findByOwner(creator._id);
      expect(groups).toHaveLength(2);
    });
  });
});
