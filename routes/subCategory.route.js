import express from "express";
import multer from "multer";
import { createSubCategory, deleteSubCategories, getSubCategories, toggleInTrend, toggleStatus, updateSubCategory } from "../controllers/subCategory.controller.js";

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.single("image"), createSubCategory);

router.get("/", getSubCategories);
router.put("/:id", upload.single("image"), updateSubCategory);

router.delete("/:id", deleteSubCategories );
router.patch("/:id/status", toggleStatus);
router.patch("/:id/trend", toggleInTrend);

export default router;
