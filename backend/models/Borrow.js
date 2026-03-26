const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    toy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    returnDate: Date,
    status: {
      type: String,
      enum: ["active", "returned", "overdue", "extended"],
      default: "active",
    },
    extendCount: {
      type: Number,
      default: 0,
      max: 2,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Borrow", borrowSchema);
