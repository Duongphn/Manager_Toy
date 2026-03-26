const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/toys", require("./routes/toyRoutes"));
app.use("/api/borrows", require("./routes/borrowRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Auto-seed categories if empty
    const Category = require("./models/Category");
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany([
        { name: "Action Figures", description: "Superhero and character figures" },
        { name: "Board Games", description: "Family and kids board games" },
        { name: "Building Blocks", description: "LEGO, Duplo and similar" },
        { name: "Dolls", description: "Dolls and accessories" },
        { name: "Educational", description: "Learning and STEM toys" },
        { name: "Outdoor", description: "Bikes, scooters, ball games" },
        { name: "Puzzles", description: "Jigsaw and 3D puzzles" },
        { name: "Vehicles", description: "Cars, trucks, trains" },
      ]);
      console.log("Seeded 8 categories");
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
