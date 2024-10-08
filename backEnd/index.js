const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

const userProfileRoutes = require("./routes/userProfileRoutes");

const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const contactRoutes = require("./routes/contactRoutes");

const errorHadler = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const multer = require("multer");

const upload = multer();

//enviromental variable form .env
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(bodyParser.json());
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/event", eventRoutes);

app.use("/api", userProfileRoutes);

app.use("/api/user", userRoutes);

app.use("/api/review", reviewRoutes);

app.use("/api/contact/", contactRoutes);

// Error handling
app.use(errorHadler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running perfectly! Running on port ${PORT}`);
});
