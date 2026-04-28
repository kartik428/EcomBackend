import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);