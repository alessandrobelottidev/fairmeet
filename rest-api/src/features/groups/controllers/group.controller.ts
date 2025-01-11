import { IGroupDocument } from '../types/group.interface';
import { CustomError } from '@core/middlewares/errors/custom.error';
import GroupModel from '@features/groups/models/group';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';

const fetchUserGroups: RequestHandler = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.user_id);

    // Get groups where user is a member
    const groupsAsMember: IGroupDocument[] = await GroupModel.findByMember(userId);

    // Get groups where user is the owner
    const groupsAsOwner: IGroupDocument[] = await GroupModel.findByOwner(userId);

    // Combine the results, removing duplicates
    const allGroups = [
      ...groupsAsMember,
      ...groupsAsOwner.filter((ownerGroup) => {
        return !groupsAsMember.some((memberGroup) =>
          (memberGroup._id as mongoose.Types.ObjectId).equals(
            ownerGroup._id as mongoose.Types.ObjectId,
          ),
        );
      }),
    ];

    res.status(200).json(allGroups);
  } catch (error) {
    next(new CustomError('Error fetching user groups', 500));
  }
};

const createGroup: RequestHandler = async (req, res, next) => {
  const group = new GroupModel({
    name: req.body.name,
    description: req.body.description,
    members: [],
    createdBy: req.body.user.id,
  });

  await group.save();

  res.status(200).json(group);
};

export default { createGroup, fetchUserGroups };
