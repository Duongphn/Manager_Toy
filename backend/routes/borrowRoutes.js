const router = require("express").Router();
const Borrow = require("../models/Borrow");
const Toy = require("../models/Toy");
const auth = require("../middleware/auth");

// GET /api/borrows/mine — Get current user's borrows
router.get("/mine", auth, async (req, res) => {
  try {
    const borrows = await Borrow.find({ borrower: req.user._id })
      .populate({
        path: "toy",
        populate: { path: "category", select: "name" },
      })
      .populate("owner", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/borrows/stats — Dashboard stats
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalToys = await Toy.countDocuments({ owner: userId });
    const activeBorrows = await Borrow.countDocuments({ borrower: userId, status: "active" });
    const totalBorrows = await Borrow.countDocuments({ borrower: userId });
    const availableToys = await Toy.countDocuments({ owner: userId, status: "available" });

    res.json({ totalToys, activeBorrows, totalBorrows, availableToys });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/borrows — Borrow a toy
router.post("/", auth, async (req, res) => {
  try {
    const { toyId, dueDate } = req.body;
    const toy = await Toy.findById(toyId);

    if (!toy) return res.status(404).json({ message: "Toy not found" });
    if (toy.status !== "available") {
      return res.status(400).json({ message: "Toy is not available" });
    }
    if (toy.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot borrow your own toy" });
    }

    const borrow = await Borrow.create({
      toy: toyId,
      borrower: req.user._id,
      owner: toy.owner,
      dueDate,
    });

    toy.status = "borrowed";
    await toy.save();

    const populated = await borrow.populate([
      { path: "toy", populate: { path: "category", select: "name" } },
      { path: "owner", select: "firstName lastName" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/borrows/:id/return — Return a toy
router.put("/:id/return", auth, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    if (borrow.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (borrow.status === "returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();
    await borrow.save();

    await Toy.findByIdAndUpdate(borrow.toy, { status: "available" });

    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/borrows/:id/extend — Extend borrow period
router.put("/:id/extend", auth, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    if (borrow.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (borrow.extendCount >= 2) {
      return res.status(400).json({ message: "Maximum extensions reached" });
    }

    const newDue = new Date(borrow.dueDate);
    newDue.setDate(newDue.getDate() + 7); // extend by 7 days
    borrow.dueDate = newDue;
    borrow.extendCount += 1;
    borrow.status = "extended";
    await borrow.save();

    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
