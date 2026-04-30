import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },

    password: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["personal", "business"],
      default: "personal",
    },

    //    accountType: {
    //   type: String,
    //   enum: ["B2B", "B2C"],
    //   default: "B2C",
    // },


    // 🏢 B2B fields
    companyName: {
      type: String,
      default: null,
    },

    gstin: {
      type: String,
      default: null,
    },

    companyAddress: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("User", userSchema);