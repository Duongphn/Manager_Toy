const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const Toy = require("../models/Toy");
const Borrow = require("../models/Borrow");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `toy-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

function parseAgeRange(body) {
  if (body.ageRange) {
    try {
      const parsed = JSON.parse(body.ageRange);
      if (parsed && Number.isFinite(Number(parsed.min)) && Number.isFinite(Number(parsed.max))) {
        return { min: Number(parsed.min), max: Number(parsed.max) };
      }
    } catch (_) {
      // Fall through to ageMin/ageMax parsing.
    }
  }

  if (body.ageMin !== undefined || body.ageMax !== undefined) {
    if (body.ageMin === "" || body.ageMax === "") return undefined;
    const min = Number(body.ageMin);
    const max = Number(body.ageMax);
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return { min, max };
    }
  }

  return undefined;
}

function buildToyPayload(req, body, file, { includeStatus = false } = {}) {
  const payload = {};

  if (body.name !== undefined) payload.name = body.name;
  if (body.category !== undefined) payload.category = body.category;
  if (body.description !== undefined) payload.description = body.description;
  if (body.condition !== undefined) payload.condition = body.condition;
  if (includeStatus && body.status !== undefined) payload.status = body.status;

  const ageRange = parseAgeRange(body);
  if (ageRange !== undefined) payload.ageRange = ageRange;

  if (file) {
    payload.photo = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  } else if (body.photo !== undefined) {
    payload.photo = body.photo;
  }

  return payload;
}

// GET /api/toys — Browse all available toys
router.get("/", auth, async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const toys = await Toy.find(filter)
      .populate("category", "name")
      .populate("owner", "firstName lastName")
      .sort({ createdAt: -1 });

    const toyIds = toys.map((toy) => toy._id);
    let ratingByToyId = new Map();

    if (toyIds.length > 0) {
      const ratingStats = await Borrow.aggregate([
        { $match: { toy: { $in: toyIds } } },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "borrow",
            as: "reviews",
          },
        },
        { $unwind: "$reviews" },
        {
          $group: {
            _id: "$toy",
            avgRating: { $avg: "$reviews.rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      ratingByToyId = new Map(
        ratingStats.map((item) => [
          item._id.toString(),
          {
            avgRating: Number(item.avgRating.toFixed(1)),
            reviewCount: item.reviewCount,
          },
        ])
      );
    }

    const toysWithRatings = toys.map((toy) => {
      const toyObj = toy.toObject();
      const rating = ratingByToyId.get(toy._id.toString());

      return {
        ...toyObj,
        avgRating: rating?.avgRating || 0,
        reviewCount: rating?.reviewCount || 0,
      };
    });

    res.json(toysWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/toys/mine — Get current user's toys
router.get("/mine", auth, async (req, res) => {
  try {
    const toys = await Toy.find({ owner: req.user._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/toys/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id)
      .populate("category", "name")
      .populate("owner", "firstName lastName");

    if (!toy) return res.status(404).json({ message: "Toy not found" });
    res.json(toy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/toys
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const payload = buildToyPayload(req, req.body, req.file);
    const toy = await Toy.create({ ...payload, owner: req.user._id });
    const populated = await toy.populate("category", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/toys/:id
router.put("/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) return res.status(404).json({ message: "Toy not found" });
    if (toy.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const payload = buildToyPayload(req, req.body, req.file, { includeStatus: true });
    Object.assign(toy, payload);
    await toy.save();
    const populated = await toy.populate("category", "name");
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/toys/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) return res.status(404).json({ message: "Toy not found" });
    if (toy.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await toy.deleteOne();
    res.json({ message: "Toy deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
