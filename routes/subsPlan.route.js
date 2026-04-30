import express from "express";
import {
  createPlan,
  getPlans,
  deletePlan,
  updatePlan,
  togglePlanStatus,
} from "../controllers/subsPlan.controller.js";

const router = express.Router();

router.post("/", createPlan);
router.get("/", getPlans);
router.delete("/:id", deletePlan);
router.put("/:id", updatePlan);
router.patch("/:id/toggle", togglePlanStatus);

export default router;
