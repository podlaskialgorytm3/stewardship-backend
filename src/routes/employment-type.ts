import { Router } from "express";

import UserAuthentication from "../middlewares/auth";
import { EmploymentTypeController } from "../controllers/employment-type";

const router = Router();
const employmentTypeController = new EmploymentTypeController();
const userAuthentication = new UserAuthentication();

router.post(
  "/employment-type",
  userAuthentication.authMiddleware,
  employmentTypeController.postEmploymentType
);

router.get(
  "/employment-type",
  userAuthentication.authMiddleware,
  employmentTypeController.getEmploymentType
);

export default router;