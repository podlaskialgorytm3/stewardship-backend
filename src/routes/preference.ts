import express from "express";
import UserAuthentication from "../middlewares/auth";
import { PreferenceController } from "../controllers/preference";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const preferenceController = new PreferenceController();

router.post(
  "/preference",
  userAuthentication.authMiddleware,
  preferenceController.postPreference
);

export default router;
