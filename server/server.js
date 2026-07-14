const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const appointmentRoutes = require("./routes/appointments");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const medicalRoutes = require("./routes/medicalRecords");
const adminRoutes = require("./routes/admin");
const doctorUploadRoutes = require("./routes/doctorUploads");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB Atlas:", error.message);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("Hospital server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", doctorUploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
