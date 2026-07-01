import express from "express";
import {
    changePassword,
  createUser,
  deleteUser,
  getUsers,
  getUserStats,
  isAdmin,
  login,
  signUp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middileware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.get("/", getUsers);
router.get("/user-stats", getUserStats);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.post("/create-user", verifyToken, isAdmin, createUser);
router.put("/change-password/:id", verifyToken, changePassword);

export default router;
