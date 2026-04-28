import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    categoryId: {
      type: String,
      required: true,
    },

    image: {
      type: String, // store image URL or path
    },

    metaTitle: {
      type: String,
    },

    metaKeywords: [
      {
        type: String,
      },
    ],

    metaDescription: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    inTrend: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SubCategory", subCategorySchema);
