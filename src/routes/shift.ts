import { Router } from "express";

import UserAuthentication from "../middlewares/auth";
import { ShiftController } from "../controllers/shift";

const router = Router();
const shiftController = new ShiftController();
const userAuthentication = new UserAuthentication();

router.post(
  "/shift",
  userAuthentication.authMiddleware,
  shiftController.postShift
);

export default router;
