const router = require("express").Router();
const Review = require("../models/Review");
const Borrow = require("../models/Borrow");
const auth = require("../middleware/auth");

// POST /api/reviews
router.post("/", auth, async (req, res) => {
  try {
    const { borrowId, rating, comment } = req.body;
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    if (borrow.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (borrow.status !== "returned") {
      return res.status(400).json({ message: "Can only review after returning" });
    }

    const review = await Review.create({
      borrow: borrowId,
      reviewer: req.user._id,
      reviewedUser: borrow.owner,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already reviewed this borrow" });
    }
    res.status(400).json({ message: error.message });
  }
});

// GET /api/reviews/user/:userId
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate("reviewer", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
