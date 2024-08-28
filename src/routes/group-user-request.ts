import express from "express";
import UserAuthentication from "../middlewares/auth";
import GroupUserRequestController from "../controllers/group-user-request";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const groupUserRequestController = new GroupUserRequestController();

router.post(
  "/group-user-request",
  userAuthentication.authMiddleware,
  groupUserRequestController.postGroupUserRequest
);
router.get(
  "/group-user-request",
  userAuthentication.authMiddleware,
  groupUserRequestController.getGroupUserRequest
);
router.get(
  "/group-user-request/not-added-users",
  userAuthentication.authMiddleware,
  groupUserRequestController.getNotAddedUsers
);
router.put(
  "/group-user-request",
  userAuthentication.authMiddleware,
  groupUserRequestController.putGroupUserRequest
);
router.delete(
  "/group-user-request/:groupId",
  userAuthentication.authMiddleware,
  groupUserRequestController.deleteGroupUserRequest
);

export default router;
