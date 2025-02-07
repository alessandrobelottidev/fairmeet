import { createValidationHandler } from '@core/middlewares';
import { requireAuthentication } from '@features/auth/middlewares/authGuard.middleware';
import meetingController from '@features/meetings/controllers/meeting.controller';
import {
  requireAdminRole,
  requireGroupMembershipOrAdmin,
  requireMeetingCreatorOrAdmin,
} from '@features/meetings/middlewares/rbac.middleware';
import meetingValidationSchema from '@features/meetings/validators/meeting.validator';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /v1/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *               - places
 *               - radius
 *             properties:
 *               group:
 *                 type: string
 *                 description: Group ID
 *                 example: "507f1f77bcf86cd799439011"
 *               places:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     placeId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     placeType:
 *                       type: string
 *                       enum: [spot, event]
 *                       example: "spot"
 *               radius:
 *                 type: object
 *                 properties:
 *                   center:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [Point]
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [12.4924, 41.8902]
 *                   sizeInMeters:
 *                     type: number
 *                     example: 1000
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized
 *   get:
 *     summary: List meetings based on user role (admin or non-admin)
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns meetings based on user's role:
 *       - Admin users see all meetings in the system
 *       - Regular users see meetings where they are either:
 *         1. The creator of the meeting
 *         2. A member of the group the meeting belongs to
 *     responses:
 *       200:
 *         description: List of meetings
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router
  .route('/')
  .post(
    createValidationHandler(meetingValidationSchema.createMeetingSchema),
    requireAuthentication,
    requireGroupMembershipOrAdmin,
    meetingController.createMeeting,
  )
  .get(requireAuthentication, (req, res, next) => {
    const { role } = req.body.user;
    if (role === 'admin') {
      return meetingController.listMeetings(req, res, next);
    }
    return meetingController.listAccessibleMeetings(req, res, next);
  });

/**
 * @swagger
 * /v1/meetings/group:
 *   get:
 *     summary: Get meetings for a specific group
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of meetings for the group
 *       403:
 *         description: Not authorized
 */
router
  .route('/group')
  .get(requireAuthentication, requireGroupMembershipOrAdmin, meetingController.listMeetings);

/**
 * @swagger
 * /v1/meetings/{meeting_id}:
 *   get:
 *     summary: Get meeting details
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting details
 *       404:
 *         description: Meeting not found
 *   delete:
 *     summary: Delete a meeting
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Meeting not found
 */
router
  .route('/:meeting_id')
  .get(requireAuthentication, requireGroupMembershipOrAdmin, meetingController.getMeetingDetails)
  .delete(requireAuthentication, requireMeetingCreatorOrAdmin, meetingController.deleteMeeting);

/**
 * @swagger
 * /v1/meetings/{meeting_id}/votes:
 *   post:
 *     summary: Add a vote to a meeting
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selectedPlaces
 *             properties:
 *               selectedPlaces:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *     responses:
 *       200:
 *         description: Vote added successfully
 *       400:
 *         description: Invalid input or meeting already finalized
 *       403:
 *         description: Not authorized
 *   get:
 *     summary: Get all votes for a meeting
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: List of votes
 *       403:
 *         description: Not authorized
 */
router
  .route('/:meeting_id/votes')
  .post(
    requireAuthentication,
    requireGroupMembershipOrAdmin,
    createValidationHandler(meetingValidationSchema.addVoteSchema),
    meetingController.addVote,
  )
  .get(requireAuthentication, requireGroupMembershipOrAdmin, meetingController.getMeetingVotes);

/**
 * @swagger
 * /v1/meetings/{meeting_id}/votes/remove:
 *   post:
 *     summary: Remove user's vote from a meeting
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Vote removed successfully
 *       400:
 *         description: Meeting already finalized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Vote not found
 */
router
  .route('/:meeting_id/votes/remove')
  .post(requireAuthentication, requireGroupMembershipOrAdmin, meetingController.removeVote);

/**
 * @swagger
 * /v1/meetings/{meeting_id}/finalize:
 *   post:
 *     summary: Finalize place selection for a meeting
 *     tags:
 *       - Meetings | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - placeId
 *               - placeType
 *             properties:
 *               placeId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               placeType:
 *                 type: string
 *                 enum: [spot, event]
 *                 example: "spot"
 *     responses:
 *       200:
 *         description: Meeting finalized successfully
 *       400:
 *         description: Invalid input or meeting already finalized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Meeting not found
 */
router
  .route('/:meeting_id/finalize')
  .post(
    requireAuthentication,
    requireMeetingCreatorOrAdmin,
    createValidationHandler(meetingValidationSchema.finalizePlaceSchema),
    meetingController.finalizePlaceSelection,
  );

export default router;
