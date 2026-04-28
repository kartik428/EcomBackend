import express from "express";
import multer from "multer";
import { createProduct, deleteProduct, getProduct, getProductById, getSingleProduct, updateProduct } from "../controllers/product.controller.js";
import { toggleStatus } from "../controllers/product.controller.js";

const router = express.Router();

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// CREATE PRODUCT
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct );
router.get('/', getProduct);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);
router.put('/:id/status', toggleStatus);
router.get("/:id", getSingleProduct);

export default router;