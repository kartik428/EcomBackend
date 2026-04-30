import SubscriptionPlan from "../models/SubsPlan.model.js";

export const createPlan = async (req, res) => {
  try {
    const { type, title, price, maxShopping, description, discount } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newPlan = new SubscriptionPlan({
      type,
      title,
      price,
      maxShopping,
      description,
      discount,
      
    });

    await newPlan.save();

    res.status(201).json({
      message: "Plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating plan",
      error: error.message,
    });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });

    res.json({
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await SubscriptionPlan.findByIdAndDelete(req.params.id);

    res.json({ message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const updated = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Plan updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePlanStatus = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    plan.status = plan.status === "active" ? "inactive" : "active";

    await plan.save();

    res.json({
      message: "Status updated",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};