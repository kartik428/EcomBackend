import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders );
router.get("/:id", getOrderById );
router.put("/:id", updateOrderStatus );


export default router;
