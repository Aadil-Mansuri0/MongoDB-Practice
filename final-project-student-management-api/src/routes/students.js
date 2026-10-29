const express = require("express");
const Student = require("../models/Student");
const Course = require("../models/Course");
const router = express.Router();

function pageOptions(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

router.post("/", async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.courseCode) body.courseCode = String(body.courseCode).toUpperCase();
    if (!await Course.exists({ courseCode: body.courseCode })) {
      return res.status(400).json({ error: "courseCode must reference an existing course" });
    }
    return res.status(201).json({ data: await Student.create(body) });
  } catch (err) { return next(err); }
});

router.get("/", async (req, res, next) => {
  try {
    const { page, limit, skip } = pageOptions(req.query);
    const filter = {};
    if (req.query.courseCode) filter.courseCode = String(req.query.courseCode).toUpperCase();
    if (req.query.department) filter.department = req.query.department;
    if (req.query.semester !== undefined) {
      const semester = Number(req.query.semester);
      if (!Number.isInteger(semester) || semester < 1 || semester > 12) return res.status(400).json({ error: "Invalid semester" });
      filter.semester = semester;
    }
    if (req.query.minMarks !== undefined || req.query.maxMarks !== undefined) {
      filter.marks = {};
      if (req.query.minMarks !== undefined) filter.marks.$gte = Number(req.query.minMarks);
      if (req.query.maxMarks !== undefined) filter.marks.$lte = Number(req.query.maxMarks);
      if (Object.values(filter.marks).some(n => !Number.isFinite(n) || n < 0 || n > 100)) {
        return res.status(400).json({ error: "Marks filters must be between 0 and 100" });
      }
    }
    const sort = req.query.sort === "marks" ? { marks: -1, studentId: 1 } : { studentId: 1 };
    const [data, total] = await Promise.all([
      Student.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Student.countDocuments(filter)
    ]);
    return res.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { return next(err); }
});

router.get("/stats/by-course", async (_req, res, next) => {
  try {
    const data = await Student.aggregate([
      { $group: { _id: "$courseCode", studentCount: { $sum: 1 }, averageMarks: { $avg: "$marks" }, highestMarks: { $max: "$marks" }, lowestMarks: { $min: "$marks" } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, courseCode: "$_id", studentCount: 1, averageMarks: { $round: ["$averageMarks", 2] }, highestMarks: 1, lowestMarks: 1 } }
    ]);
    return res.json({ data });
  } catch (err) { return next(err); }
});

router.get("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId.toUpperCase() }).lean();
    return student ? res.json({ data: student }) : res.status(404).json({ error: "Student not found" });
  } catch (err) { return next(err); }
});

router.patch("/:studentId", async (req, res, next) => {
  try {
    const allowed = ["name", "email", "semester", "department", "courseCode", "marks"];
    const updates = {};
    for (const key of allowed) if (Object.hasOwn(req.body, key)) updates[key] = req.body[key];
    if (!Object.keys(updates).length) return res.status(400).json({ error: "Provide at least one editable field" });
    if (updates.courseCode) {
      updates.courseCode = String(updates.courseCode).toUpperCase();
      if (!await Course.exists({ courseCode: updates.courseCode })) return res.status(400).json({ error: "Unknown courseCode" });
    }
    if (updates.email) updates.email = String(updates.email).toLowerCase();
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.studentId.toUpperCase() }, { $set: updates },
      { new: true, runValidators: true }
    );
    return student ? res.json({ data: student }) : res.status(404).json({ error: "Student not found" });
  } catch (err) { return next(err); }
});

router.delete("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.studentId.toUpperCase() });
    return student ? res.status(204).end() : res.status(404).json({ error: "Student not found" });
  } catch (err) { return next(err); }
});

module.exports = router;
