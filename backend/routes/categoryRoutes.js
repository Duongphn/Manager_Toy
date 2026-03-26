const router = require("express").Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");

// GET /api/categories
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
