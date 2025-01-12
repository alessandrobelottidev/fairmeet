import { AuthError } from '@core/middlewares/errors/auth.error';
import { CustomError } from '@core/middlewares/errors/custom.error';
import GroupModel from '@features/groups/models/group';
import MeetingModel from '@features/meetings/models/meeting.model';
import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const requireGroupMembershipOrAdmin: RequestHandler = async (req, res, next) => {
  try {
    const decoded = req.body.user;

    // If user is admin, allow access
    if (decoded.role === 'admin') {
      return next();
    }

    // For group-specific queries
    let groupId: mongoose.Types.ObjectId;

    // Get group ID from:
    // 1. Query params (for GET requests)
    // 2. Request body (for POST/creation requests)
    // 3. Meeting itself (for meeting-specific operations)
    if (req.query.group_id) {
      groupId = new mongoose.Types.ObjectId(String(req.query.group_id));
    } else if (req.body.group) {
      groupId = new mongoose.Types.ObjectId(String(req.body.group));
    } else if (req.params.meeting_id) {
      const meeting = await MeetingModel.findById(req.params.meeting_id);
      if (!meeting) {
        throw new CustomError('Meeting not found', 404);
      }
      groupId = meeting.group;
    } else {
      throw new CustomError('Group ID is required', 400);
    }

    // Check if user is member of the group or is the creator
    const group = await GroupModel.findById(groupId);
    if (!group) {
      throw new CustomError('Group not found', 404);
    }

    const userId = new mongoose.Types.ObjectId(String(decoded.id));
    const isMember = group.members.some((memberId) => memberId.equals(userId));
    const isCreator = group.createdBy.equals(userId);

    if (!isMember && !isCreator) {
      throw new AuthError(
        'Authorization Error',
        403,
        'User must be a member or creator of this group',
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireMeetingCreatorOrAdmin: RequestHandler = async (req, res, next) => {
  try {
    const decoded = req.body.user as JwtPayload;

    // If user is admin, allow access
    if (decoded.role === 'admin') {
      return next();
    }

    const meeting = await MeetingModel.findById(req.params.meeting_id);
    if (!meeting) {
      throw new CustomError('Meeting not found', 404);
    }

    if (!meeting.creator.equals(new mongoose.Types.ObjectId(decoded.id))) {
      throw new AuthError(
        'Authorization Error',
        403,
        'Only meeting creator can perform this action',
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdminRole: RequestHandler = async (req, res, next) => {
  try {
    const decoded = req.body.user as JwtPayload;

    if (decoded.role !== 'admin') {
      throw new AuthError('Authorization Error', 403, 'Admin role required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
