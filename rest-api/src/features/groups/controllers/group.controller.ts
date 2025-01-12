import MessageModel from '../models/message';
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

const getGroupDetails: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.params;

    const group = await GroupModel.findById(group_id).populate('members createdBy');
    if (!group) {
      throw new CustomError('Group not found', 404);
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

const deleteGroup: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.params;

    const group = await GroupModel.findByIdAndDelete(group_id);
    if (!group) {
      throw new CustomError('Group not found', 404);
    }

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const addGroupMember: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const { userId } = req.body;

    const group = await GroupModel.findById(group_id);
    if (!group) {
      throw new CustomError('Group not found', 404);
    }

    await group.addMember(new mongoose.Types.ObjectId(userId));

    res.status(200).json({ message: 'Member added successfully', group });
  } catch (error) {
    next(error);
  }
};

const removeGroupMember: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const { userId } = req.body;

    const group = await GroupModel.findById(group_id);
    if (!group) {
      throw new CustomError('Group not found', 404);
    }

    await group.removeMember(new mongoose.Types.ObjectId(userId));

    res.status(200).json({ message: 'Member removed successfully', group });
  } catch (error) {
    next(error);
  }
};

const fetchGroupMessages: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.params;

    const messages = await MessageModel.findByGroup(new mongoose.Types.ObjectId(group_id));

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const { content } = req.body;
    const senderId = req.body.user.id;

    const message = new MessageModel({
      content,
      sender: new mongoose.Types.ObjectId(senderId),
      group: new mongoose.Types.ObjectId(group_id),
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const editMessage: RequestHandler = async (req, res, next) => {
  try {
    const { message_id } = req.params;
    const { content } = req.body;

    const message = await MessageModel.findByIdAndUpdate(
      message_id,
      { content },
      { new: true, runValidators: true },
    );

    if (!message) {
      throw new CustomError('Message not found', 404);
    }

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    const { message_id } = req.params;

    const message = await MessageModel.findByIdAndDelete(message_id);
    if (!message) {
      throw new CustomError('Message not found', 404);
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  getGroupDetails,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  fetchGroupMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  createGroup,
  fetchUserGroups,
};
