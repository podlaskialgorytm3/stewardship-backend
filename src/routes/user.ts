import express from "express";
import UserAuthentication from "../middlewares/auth";
import UserController from "../controllers/user";

const userController = new UserController();
const userAuthentication = new UserAuthentication();
const router = express.Router();

router.post("/user", userController.postUser);
router.get(`/user`, userAuthentication.authMiddleware, userController.getUser);
router.post("/user/login", userController.getUserLogin);
router.delete(
  `/user/:id`,
  userAuthentication.authMiddleware,
  userController.getUserById
);
router.put(
  "/user/email/change",
  userAuthentication.authMiddleware,
  userController.putEmailChange
);
router.post("/user/password/reset", userController.postPasswordReset);
router.put("/user/password/reset", userController.putPasswordReset);
router.post(
  "/user/logout",
  userAuthentication.authMiddleware,
  userController.postUserLogout
);
router.get("/user/token/validate", userController.getIfTokenIsValid);
router.put(
  "/user/img/change",
  userAuthentication.authMiddleware,
  userController.putImgChange
);
router.put(
  "/user/name/change",
  userAuthentication.authMiddleware,
  userController.putNameChange
);
router.put(
  "/user/password/change",
  userAuthentication.authMiddleware,
  userController.putPasswordChange
);

export default router;
