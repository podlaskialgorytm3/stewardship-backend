import express from "express";
import { Request, Response } from "express";
import UserAuthentication from "../middlewares/auth";

const router = express.Router();
const userAuthentication = new UserAuthentication();

export default router;
