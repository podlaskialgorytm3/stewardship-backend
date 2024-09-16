import express from "express";
import UserAuthentication from "../middlewares/auth";
import { UnavailableDayController } from "../controllers/unavaiable-day";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const unavailableDayController = new UnavailableDayController();

router.post(
  "/unavailable-day",
  userAuthentication.authMiddleware,
  unavailableDayController.postUnavaiableDay
);

export default router;
