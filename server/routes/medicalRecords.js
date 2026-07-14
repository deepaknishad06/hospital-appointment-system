const express = require("express");
const MedicalRecord = require("../models/MedicalRecord");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.post("/", requireRole("doctor"), async (req, res, next) => {
  try {
    const { patientId, title, type, description, fileUrl, doctorNotes } =
      req.body;
    if (!patientId || !title) {
      return res
        .status(400)
        .json({ message: "Patient ID and title are required" });
    }

    const record = new MedicalRecord({
      patient: patientId,
      doctor: req.user._id,
      title,
      type,
      description,
      fileUrl,
      doctorNotes,
    });

    await record.save();
    return res.status(201).json({ message: "Medical record saved", record });
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
    const records = await MedicalRecord.find(query)
      .populate("doctor", "name specialization email")
      .populate("patient", "name email phone");

    return res.json({ records });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
