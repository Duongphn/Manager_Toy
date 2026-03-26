const mongoose = require("mongoose");

const toySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Toy name is required"],
      trim: true,
    },
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    ageRange: {
      min: { type: Number, min: 0, default: 0 },
      max: { type: Number, min: 0, default: 12 },
    },
    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair"],
      default: "good",
    },
    photo: String,
    status: {
      type: String,
      enum: ["available", "borrowed", "unavailable"],
      default: "available",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Toy", toySchema);
