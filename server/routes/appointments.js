const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.post("/", async (req, res, next) => {
  try {
    const {
      doctorId,
      doctor,
      appointmentDate,
      appointmentTime,
      symptoms,
      phone,
    } = req.body;
    const patientId =
      req.user.role === "patient" ? req.user._id : req.body.patientId;
    const doctorLookup = doctorId || doctor;

    if (!doctorLookup || !appointmentDate || !appointmentTime) {
      return res
        .status(400)
        .json({ message: "Doctor, date, and time are required" });
    }

    const normalizedLookup = String(doctorLookup).trim();
    const doctorNameMap = {
      "sandeep-chopra": "Dr. Sandeep Chopra",
      "jagminder-singh": "Dr. Jagminder Singh",
      "hunny-bansal": "Dr. Hunny Bansal",
    };
    const resolvedName =
      req.body.doctorName ||
      doctorNameMap[normalizedLookup.toLowerCase()] ||
      normalizedLookup ||
      "Doctor";

    let matchedDoctor = null;

    if (mongoose.Types.ObjectId.isValid(doctorLookup)) {
      matchedDoctor = await User.findOne({ _id: doctorLookup, role: "doctor" });
    }

    if (!matchedDoctor) {
      const escapedName = resolvedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchedDoctor = await User.findOne({
        role: "doctor",
        $or: [
          { name: { $regex: new RegExp(`^${escapedName}$`, "i") } },
          {
            name: {
              $regex: new RegExp(
                `^${normalizedLookup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                "i",
              ),
            },
          },
        ],
      });
    }

    if (!matchedDoctor) {
      const safeSlug =
        String(resolvedName)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "doctor";
      const tempDoctor = new User({
        name: resolvedName,
        email: `${safeSlug}-${Date.now()}@placeholder.local`,
        passwordHash: await bcrypt.hash("temporary-password", 10),
        role: "doctor",
        isAdmin: false,
        specialization: "General",
      });
      matchedDoctor = await tempDoctor.save();
    }

    if (!patientId) {
      return res
        .status(400)
        .json({ message: "Patient identification is required" });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointment = new Appointment({
      patient: patient._id,
      doctor: matchedDoctor._id,
      patientName: patient.name,
      email: patient.email,
      phone: phone || patient.phone,
      appointmentDate,
      appointmentTime,
      symptoms,
      status: "pending",
    });

    const savedAppointment = await appointment.save();
    return res.status(201).json({
      message: "Appointment created successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query =
      req.user.role === "doctor"
        ? { doctor: req.user._id }
        : { patient: req.user._id };
    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone details")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.json({ appointments });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = (({
      appointmentDate,
      appointmentTime,
      symptoms,
      phone,
    }) => ({ appointmentDate, appointmentTime, symptoms, phone }))(req.body);
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role === "patient" &&
      !appointment.patient.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    if (
      req.user.role === "doctor" &&
      !appointment.doctor.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        appointment[key] = value;
      }
    });

    const updated = await appointment.save();
    return res.json({ message: "Appointment updated", appointment: updated });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireRole("doctor"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.doctor.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment status" });
    }

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    appointment.status = status;
    await appointment.save();
    return res.json({ message: "Appointment status updated", appointment });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isOwner =
      req.user.role === "patient" && appointment.patient.equals(req.user._id);
    const isDoctor =
      req.user.role === "doctor" && appointment.doctor.equals(req.user._id);
    if (!isOwner && !isDoctor) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne();
    return res.json({ message: "Appointment removed" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
