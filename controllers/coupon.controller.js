import couponSchema from "../models/Coupon.model.js";
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
    } = req.body;

    // check duplicate
    const existing = await couponSchema.findOne({ code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    const coupon = await couponSchema.create({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await couponSchema.find();

    res.json({
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can't fetch coupons",
    });
  }
};

export const deleteCoupons = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await couponSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "coupon not found",
      });
    }

    res.json({
      message: "coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting coupon",
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res.status(400).json({
        message: "Coupon code and cart total required",
      });
    }

    const coupon = await couponSchema.findOne({ code });

    // ❌ Not found
    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon code",
      });
    }

    // ❌ Expired
    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        message: "Coupon expired",
      });
    }

    // ❌ Min order not met
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order should be ₹${coupon.minOrderValue}`,
      });
    }

    // ❌ Usage limit reached
    if (
      coupon.usageLimit &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        message: "Coupon usage limit reached",
      });
    }

    // 🔥 Calculate discount
    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    // ❗ prevent negative total
    discount = Math.min(discount, cartTotal);

    const finalAmount = cartTotal - discount;

    return res.status(200).json({
      success: true,
      discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};