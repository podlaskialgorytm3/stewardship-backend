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

router.get(
  "/shift",
  userAuthentication.authMiddleware,
  shiftController.getShifts
);

router.get(
  "/shift/:shiftId",
  userAuthentication.authMiddleware,
  shiftController.getShift
);

router.put(
  "/shift/:shiftId",
  userAuthentication.authMiddleware,
  shiftController.putShift
);

export default router;
