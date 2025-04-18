import express from "express";
import {
  handleAdminLogin,
  handleLogin,
  handleRegister,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", handleRegister);
userRouter.post("/login", handleLogin);
userRouter.post("/admin", handleAdminLogin);

export default userRouter;
