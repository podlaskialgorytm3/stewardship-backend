import express from "express";
import UserAuthentication from "../middlewares/auth";
import { SkillController } from "../controllers/skill";

const userAuthentication = new UserAuthentication();
const router = express.Router();
const skillController = new SkillController();

router.post(
  "/skill",
  userAuthentication.authMiddleware,
  skillController.postSkill
);

export default router;
