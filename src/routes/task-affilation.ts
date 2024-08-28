import express from "express";
import UserAuthentication from "../middlewares/auth";
import TaskAffilationController from "../controllers/task-affilation";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const taskAffilationController = new TaskAffilationController();

router.post(
  "/task-affilation",
  userAuthentication.authMiddleware,
  taskAffilationController.postTaskAffilation
);
router.get(
  "/task-affilation",
  userAuthentication.authMiddleware,
  taskAffilationController.getTaskAffilation
);
router.get(
  "/task-affilation/off-task",
  userAuthentication.authMiddleware,
  taskAffilationController.getTaskAffilationOffTask
);
router.delete(
  "/task-affilation",
  userAuthentication.authMiddleware,
  taskAffilationController.deleteTaskAffilation
);

export default router;
