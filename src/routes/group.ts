import express from "express";
import UserAuthentication from "../middlewares/auth";
import GroupController from "../controllers/group";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const groupController = new GroupController();

router.post(
  "/group",
  userAuthentication.authMiddleware,
  groupController.postGroup
);
router.get(
  "/group/:id",
  userAuthentication.authMiddleware,
  groupController.getGroup
);
router.put(
  "/group/:id",
  userAuthentication.authMiddleware,
  groupController.putGroup
);
router.delete(
  "/group/:id",
  userAuthentication.authMiddleware,
  groupController.deleteGroup
);
router.get(
  "/group/search/:name",
  userAuthentication.authMiddleware,
  groupController.getSearchGroup
);

export default router;
