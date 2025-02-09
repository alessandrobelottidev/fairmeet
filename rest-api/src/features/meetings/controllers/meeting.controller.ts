import { IMeeting } from '../types/meeting.interface';
import { CustomError } from '@core/middlewares/errors/custom.error';
import GroupModel from '@features/groups/models/group';
import MeetingModel from '@features/meetings/models/meeting.model';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';

const createMeeting: RequestHandler = async (req, res, next) => {
  try {
    const meeting = new MeetingModel({
      ...req.body,
      creator: req.body.user.id,
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
};

const getMeetingDetails: RequestHandler = async (req, res, next) => {
  try {
    const meeting = await MeetingModel.findById(req.params.meeting_id)
      .populate('creator')
      .populate('group');

    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

const listMeetings: RequestHandler = async (req, res, next) => {
  try {
    const { group_id } = req.query;

    let query = {};
    if (group_id) {
      query = { group: new mongoose.Types.ObjectId(group_id as string) };
    }

    const meetings = await MeetingModel.find(query)
      .populate('creator')
      .populate('group')
      .sort({ createdAt: -1 });

    res.status(200).json(meetings);
  } catch (error) {
    next(error);
  }
};

const listAccessibleMeetings: RequestHandler = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(String(req.body.user.id));

    // Get all groups where user is a member
    const userGroups = await GroupModel.find({
      $or: [{ members: userId }, { createdBy: userId }],
    }).select('_id');

    const groupIds = userGroups.map((group) => group._id);

    // User should see meetings where they are either:
    // 1. The creator of the meeting OR
    // 2. A member of the group the meeting belongs to
    const query = {
      $or: [{ creator: userId }, { group: { $in: groupIds } }],
    };

    const meetings = await MeetingModel.find(query)
      .populate('creator')
      .populate('group')
      .sort({ createdAt: -1 });

    res.status(200).json(meetings);
  } catch (error) {
    next(error);
  }
};

const deleteMeeting: RequestHandler = async (req, res, next) => {
  try {
    const meeting = await MeetingModel.findById(req.params.meeting_id);

    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    await meeting.deleteOne();
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const addVote: RequestHandler = async (req, res, next) => {
  try {
    const meeting = await MeetingModel.findById(req.params.meeting_id);
    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    if ((meeting as IMeeting).chosenPlace?.placeId) {
      throw new CustomError('Meeting has already been finalized', 400);
    }

    await meeting.addVote(
      new mongoose.Types.ObjectId(String(req.body.user.id)),
      req.body.selectedPlaces.map((id: string) => new mongoose.Types.ObjectId(id)),
    );

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

const removeVote: RequestHandler = async (req, res, next) => {
  try {
    const meeting = await MeetingModel.findById(req.params.meeting_id);
    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    if ((meeting as IMeeting).chosenPlace?.placeId) {
      throw new CustomError('Meeting has already been finalized', 400);
    }

    // Find and remove the vote
    const voteIndex = meeting.votes.findIndex((vote) =>
      vote.userId.equals(new mongoose.Types.ObjectId(String(req.body.user.id))),
    );

    if (voteIndex === -1) {
      throw new CustomError('Vote not found', 404);
    }

    meeting.votes.splice(voteIndex, 1);
    await meeting.save();

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

const getMeetingVotes: RequestHandler = async (req, res, next) => {
  try {
    const meeting = await MeetingModel.findById(req.params.meeting_id).populate(
      'votes.userId',
      'name email',
    );

    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    res.status(200).json(meeting.votes);
  } catch (error) {
    next(error);
  }
};

const finalizePlaceSelection: RequestHandler = async (req, res, next) => {
  try {
    const meeting = await MeetingModel.findById(req.params.meeting_id);

    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    if ((meeting as IMeeting).chosenPlace?.placeId) {
      throw new CustomError('Meeting has already been finalized', 400);
    }

    await meeting.finalizePlace(new mongoose.Types.ObjectId(req.body.placeId), req.body.placeType);

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

export default {
  createMeeting,
  getMeetingDetails,
  listMeetings,
  listAccessibleMeetings,
  deleteMeeting,
  addVote,
  removeVote,
  getMeetingVotes,
  finalizePlaceSelection,
};
