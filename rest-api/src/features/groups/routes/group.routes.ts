import { requireAuthentication } from '@features/auth/middlewares/authGuard.middleware';
import groupController from '@features/groups/controllers/group.controller';
import { requireOwnershipOfThisUser } from '@features/groups/middlewares/rbac.middleware';
import { validateCreateGroupReqParams } from '@features/groups/middlewares/validation.middleware';
import e from 'express';

const router = e.Router();

router
  .route('/:user_id/groups')
  .get(requireAuthentication, requireOwnershipOfThisUser, groupController.fetchUserGroups)
  .post(validateCreateGroupReqParams, requireAuthentication, groupController.createGroup);

router.route('/:user_id/groups/:group_id').get(requireAuthentication).delete(requireAuthentication);

export default router;
