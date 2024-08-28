import express from "express";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";

const userAuthentication = new UserAuthentication();
const router = express.Router();
const groupUserController = new GroupUserController();

router.get(
  "/group-user",
  userAuthentication.authMiddleware,
  groupUserController.getGroupUser
);
router.get(
  "/group-user/without-creator",
  userAuthentication.authMiddleware,
  groupUserController.getGroupUserWithoutCreator
);
router.delete(
  "/group-user",
  userAuthentication.authMiddleware,
  groupUserController.deleteGroupUser
);
router.put("/group-user", userAuthentication.authMiddleware);
router.post(
  "/group-user/invite",
  userAuthentication.authMiddleware,
  groupUserController.postGroupUserInvite
);
router.get(
  "/group-user/is-member/:groupId",
  userAuthentication.authMiddleware,
  groupUserController.getIsMember
);
router.get(
  "/group-user/is-admin/:groupId",
  userAuthentication.authMiddleware,
  groupUserController.getIsAdmin
);

export default router;
