import express from "express";
import UserAuthentication from "../middlewares/auth";
import { GroupSkillController } from "../controllers/group-skill";

const userAuthentication = new UserAuthentication();
const groupSkillController = new GroupSkillController();
const router = express.Router();

router.post(
  "/group-skill",
  userAuthentication.authMiddleware,
  groupSkillController.postGroupSkill
);

router.get(
  "/group-skill/belonging",
  userAuthentication.authMiddleware,
  groupSkillController.getBelongingSkills
);
router.get(
  "/group-skill/not-belonging",
  userAuthentication.authMiddleware,
  groupSkillController.getNotBelongingSkills
);

export default router;
