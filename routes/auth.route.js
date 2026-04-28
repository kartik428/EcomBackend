import express from "express";
import { createUser, deleteUser, getUsers, login, signUp, verifyOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
console.log("AUTH ROUTES LOADED");

export default router;
