const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, trim: true, uppercase: true, match: /^[A-Z]{2,5}[0-9]{2,4}$/ },
  courseName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  department: { type: String, required: true, trim: true, maxlength: 100 },
  credits: { type: Number, required: true, min: 1, max: 10 },
  instructor: { type: String, required: true, trim: true, maxlength: 100 }
}, { timestamps: true, versionKey: false });

courseSchema.index({ courseCode: 1 }, { unique: true, name: "uq_course_code" });
courseSchema.index({ department: 1, courseName: 1 }, { name: "department_course_name" });

module.exports = mongoose.model("Course", courseSchema);
