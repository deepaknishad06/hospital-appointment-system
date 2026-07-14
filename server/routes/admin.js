const express = require("express");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(auth);
router.use(requireRole("doctor"));

router.get("/doctors/pending", async (req, res, next) => {
  try {
    const pending = await User.find({ role: "doctor", isAdmin: false });
    return res.json({ pending });
  } catch (error) {
    next(error);
  }
});

router.patch("/doctors/approve/:id", async (req, res, next) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    doctor.isAdmin = true;
    await doctor.save();
    return res.json({ message: "Doctor promoted to admin" });
  } catch (error) {
    next(error);
  }
});

router.get("/patients", async (req, res, next) => {
  try {
    const patients = await User.find({ role: "patient" }).select(
      "-passwordHash",
    );
    return res.json({ patients });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
