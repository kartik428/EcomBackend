import express from "express";
import { createCategory, deleteCategories, getCategories, updateCategory } from "../controllers/category.controller.js";
import multer from "multer";
import { toggleStatus } from "../controllers/category.controller.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post("/", upload.single("image"), createCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.get("/", getCategories);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", deleteCategories);

export default router;
