import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["B2B", "B2C"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    maxShopping: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    discount: {
      b2b: {
        type: Number,
        default: 0,
      },
      b2c: {
        type: Number,
        default: 0,
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubscriptionPlan", planSchema);