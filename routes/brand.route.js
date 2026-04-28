import express from "express";
import { createBrands, deleteBrands, getBrands, updateBrands } from "../controllers/brand.controller.js";
import multer from "multer";

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

router.post("/", upload.single("banner"), createBrands);
router.put("/:id", upload.single("banner"), updateBrands);
router.get("/", getBrands);
router.delete("/:id", deleteBrands);

export default router;
