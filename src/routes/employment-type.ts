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
  employmentTypeController.getEmploymentTypes
);

router.get(
  "/employment-type/:employmentTypeId",
  userAuthentication.authMiddleware,
  employmentTypeController.getEmploymentType
);

router.put(
  "/employment-type",
  userAuthentication.authMiddleware,
  employmentTypeController.putEmploymentType
);

router.delete(
  "/employment-type",
  userAuthentication.authMiddleware,
  employmentTypeController.deleteEmploymentType
);
export default router;
