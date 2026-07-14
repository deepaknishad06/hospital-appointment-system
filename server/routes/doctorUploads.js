const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads", "doctor-gallery");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const doctorDir = path.join(uploadDir, req.params.doctorId);
    if (!fs.existsSync(doctorDir)) {
      fs.mkdirSync(doctorDir, { recursive: true });
    }
    cb(null, doctorDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const buildBaseUrl = (req) => {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, "");
  }

  return `${req.protocol}://${req.get("host")}`;
};

router.post(
  "/doctor-gallery/:doctorId",
  auth,
  requireAdmin,
  upload.array("images", 10),
  (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const baseUrl = buildBaseUrl(req);
    const uploadedImages = req.files.map(
      (file) =>
        `${baseUrl}/uploads/doctor-gallery/${req.params.doctorId}/${file.filename}`,
    );

    res.json({ images: uploadedImages });
  },
);

router.get("/doctor-gallery/:doctorId", (req, res) => {
  const doctorId = req.params.doctorId;
  const doctorDir = path.join(uploadDir, doctorId);

  if (!fs.existsSync(doctorDir)) {
    return res.json({ images: [] });
  }

  const baseUrl = buildBaseUrl(req);
  const files = fs
    .readdirSync(doctorDir)
    .filter((file) => /\.(png|jpe?g|gif|webp|svg)$/i.test(file))
    .sort()
    .map((file) => `${baseUrl}/uploads/doctor-gallery/${doctorId}/${file}`);

  res.json({ images: files });
});

module.exports = router;
