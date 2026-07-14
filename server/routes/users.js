const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 10;

router.get("/me", auth, async (req, res, next) => {
  try {
    return res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.post("/doctor/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization } = req.body;
    if (!name || !email || !password || !specialization) {
      return res
        .status(400)
        .json({
          message: "Name, email, password, and specialization are required",
        });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const doctorUser = new User({
      name,
      email,
      passwordHash,
      phone,
      specialization,
      role: "doctor",
      isAdmin: false,
    });

    await doctorUser.save();
    return res
      .status(201)
      .json({
        message: "Doctor registration submitted. Admin approval required.",
        doctorId: doctorUser._id,
      });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/doctor/approve/:doctorId",
  auth,
  requireRole("doctor"),
  async (req, res, next) => {
    try {
      const { doctorId } = req.params;
      const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      doctor.isAdmin = true;
      await doctor.save();

      return res.json({
        message: "Doctor approved as admin",
        doctorId: doctor._id,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/doctor/create-patient",
  auth,
  requireRole("doctor"),
  async (req, res, next) => {
    try {
      const { name, email, password, phone, address, age, gender } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(409)
          .json({ message: "Patient email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const patient = new User({
        name,
        email,
        passwordHash,
        phone,
        role: "patient",
        details: { address, age, gender },
      });

      await patient.save();
      return res
        .status(201)
        .json({
          message: "Patient created successfully",
          patientId: patient._id,
        });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
