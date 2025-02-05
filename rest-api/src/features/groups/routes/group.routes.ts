import groupValidationSchema from '../validators/group.validator';
import messageValidationSchema from '../validators/message.validator';
import { createValidationHandler } from '@core/middlewares';
import { requireAuthentication } from '@features/auth/middlewares/authGuard.middleware';
import groupController from '@features/groups/controllers/group.controller';
import { requireOwnershipOfThisUser } from '@features/groups/middlewares/rbac.middleware';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/users/{user_id}/groups:
 *   get:
 *     summary: Fetch all groups for a specific user
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of groups for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: User does not have ownership of the groups
 *   post:
 *     summary: Create a new group for a specific user
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the group
 *                 example: My New Group
 *               description:
 *                 type: string
 *                 description: Description of the group
 *                 example: A group for discussing new ideas
 *     responses:
 *       200:
 *         description: The newly created group
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 */
router
  .route('/:user_id/groups')
  .get(requireAuthentication, requireOwnershipOfThisUser, groupController.fetchUserGroups)
  .post(
    createValidationHandler(groupValidationSchema.createGroupReqParams),
    requireAuthentication,
    groupController.createGroup,
  );

/**
 * @swagger
 * /v1/users/{user_id}/groups/{group_id}:
 *   get:
 *     summary: Fetch details for a specific group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: Details of the specified group
 *         content:
 *           application/json:
 *             schema:
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 *   delete:
 *     summary: Delete a specific group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     responses:
 *       204:
 *         description: Group successfully deleted
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 */
router
  .route('/:user_id/groups/:group_id')
  .get(requireAuthentication, groupController.getGroupDetails)
  .delete(requireAuthentication, groupController.deleteGroup);

/**
 * @swagger
 * /v1/users/{user_id}/groups/{group_id}/members:
 *   post:
 *     summary: Add a member to a group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user performing the operation
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to add to the group
 *     responses:
 *       200:
 *         description: Member successfully added
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 *   delete:
 *     summary: Remove a member from a group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user performing the operation
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to remove from the group
 *     responses:
 *       200:
 *         description: Member successfully removed
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 */
router
  .route('/:user_id/groups/:group_id/members')
  .post(
    createValidationHandler(groupValidationSchema.modifyGroupMemberParams),
    requireAuthentication,
    groupController.addGroupMember,
  )
  .delete(
    createValidationHandler(groupValidationSchema.modifyGroupMemberParams),
    requireAuthentication,
    groupController.removeGroupMember,
  );

/**
 * @swagger
 * /v1/users/{user_id}/groups/{group_id}/messages:
 *   get:
 *     summary: Fetch messages for a specific group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user performing the operation
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           description: Maximum number of messages to retrieve
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           description: Number of messages to skip
 *     responses:
 *       200:
 *         description: List of messages in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 *   post:
 *     summary: Send a message to a group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user sending the message
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the message
 *     responses:
 *       201:
 *         description: Message successfully created
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 */
router
  .route('/:user_id/groups/:group_id/messages')
  .get(requireAuthentication, groupController.fetchGroupMessages)
  .post(requireAuthentication, groupController.sendMessage);

/**
 * @swagger
 * /v1/users/{user_id}/groups/{group_id}/messages/{message_id}:
 *   patch:
 *     summary: Edit a specific message in a group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user performing the operation
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content of the message
 *     responses:
 *       200:
 *         description: Message successfully updated
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Message not found
 *   delete:
 *     summary: Delete a specific message from a group
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user performing the operation
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 *     responses:
 *       204:
 *         description: Message successfully deleted
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Message not found
 */
router
  .route('/:user_id/groups/:group_id/messages/:message_id')
  .patch(requireAuthentication, groupController.editMessage)
  .delete(requireAuthentication, groupController.deleteMessage);

/**
 * @swagger
 * /v1/users/{user_id}/groups/{group_id}/has-updates:
 *   get:
 *     summary: Check if a group has new messages since a given timestamp
 *     tags:
 *       - Groups | FEATURE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user performing the operation
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *       - in: query
 *         name: since
 *         required: true
 *         schema:
 *           type: number
 *         description: Timestamp to check for updates since
 *     responses:
 *       200:
 *         description: Status of updates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasUpdates:
 *                   type: boolean
 *                   description: Whether there are new messages
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Group not found
 */
router.get(
  '/:user_id/groups/:group_id/has-updates',
  requireAuthentication,
  groupController.hasUpdates,
);

export default router;
