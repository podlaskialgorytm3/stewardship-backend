import express from "express";
import UserAuthentication from "../middlewares/auth";
import TaskInfoController from "../controllers/task-info";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const taskInfoController = new TaskInfoController();

router.post(
  "/task-info",
  userAuthentication.authMiddleware,
  taskInfoController.postTaskInfo
);
router.get(
  "/task-info",
  userAuthentication.authMiddleware,
  taskInfoController.getTaskInfo
);

router.get(
  "/task-info/:id",
  userAuthentication.authMiddleware,
  taskInfoController.getTaskInfoById
);

router.get(
  "/task-info/is-admin/:taskInfoId",
  userAuthentication.authMiddleware,
  taskInfoController.getIsAdminByTaskInfoId
);

router.put(
  "/task-info/:id",
  userAuthentication.authMiddleware,
  taskInfoController.putTaskInfo
);

router.delete(
  "/task-info/:taskInfoId",
  userAuthentication.authMiddleware,
  taskInfoController.deleteTaskInfo
);
router.get(
  "/task-info/is-belong-to-task/:id",
  userAuthentication.authMiddleware,
  taskInfoController.getIsBelongToTask
);

export default router;
