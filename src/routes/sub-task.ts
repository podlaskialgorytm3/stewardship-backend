import express from "express";
import UserAuthentication from "../middlewares/auth";
import SubtaskController from "../controllers/sub-task";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const subtaskController = new SubtaskController();

router.post(
  "/sub-task",
  userAuthentication.authMiddleware,
  subtaskController.postSubtask
);
router.delete(
  "/sub-task/:subtaskId",
  userAuthentication.authMiddleware,
  subtaskController.deleteSubtask
);
router.put(
  "/sub-task/:subtaskId",
  userAuthentication.authMiddleware,
  subtaskController.putSubtask
);
router.put(
  "/sub-task/change-status/:subtaskId",
  userAuthentication.authMiddleware,
  subtaskController.putChangeStatus
);
router.get(
  "/sub-task/has-right/:subtaskId",
  userAuthentication.authMiddleware,
  subtaskController.getHasRight
);

export default router;
