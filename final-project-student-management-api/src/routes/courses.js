const express = require("express");
const Course = require("../models/Course");
const Student = require("../models/Student");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.courseCode) body.courseCode = String(body.courseCode).toUpperCase();
    return res.status(201).json({ data: await Course.create(body) });
  } catch (err) { return next(err); }
});

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    const data = await Course.find(filter).sort({ courseCode: 1 }).lean();
    return res.json({ data, total: data.length });
  } catch (err) { return next(err); }
});

router.get("/:courseCode", async (req, res, next) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseCode.toUpperCase() }).lean();
    return course ? res.json({ data: course }) : res.status(404).json({ error: "Course not found" });
  } catch (err) { return next(err); }
});

router.patch("/:courseCode", async (req, res, next) => {
  try {
    const allowed = ["courseName", "department", "credits", "instructor"];
    const updates = {};
    for (const key of allowed) if (Object.hasOwn(req.body, key)) updates[key] = req.body[key];
    if (!Object.keys(updates).length) return res.status(400).json({ error: "Provide at least one editable field" });
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode.toUpperCase() }, { $set: updates },
      { new: true, runValidators: true }
    );
    return course ? res.json({ data: course }) : res.status(404).json({ error: "Course not found" });
  } catch (err) { return next(err); }
});

router.delete("/:courseCode", async (req, res, next) => {
  try {
    const code = req.params.courseCode.toUpperCase();
    if (await Student.countDocuments({ courseCode: code })) {
      return res.status(409).json({ error: "Course has enrolled students; reassign or remove them first" });
    }
    const course = await Course.findOneAndDelete({ courseCode: code });
    return course ? res.status(204).end() : res.status(404).json({ error: "Course not found" });
  } catch (err) { return next(err); }
});

module.exports = router;
