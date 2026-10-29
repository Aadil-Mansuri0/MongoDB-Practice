const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, trim: true, uppercase: true, match: /^STU[0-9]{4,8}$/ },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  semester: { type: Number, required: true, min: 1, max: 12 },
  department: { type: String, required: true, trim: true, maxlength: 100 },
  courseCode: { type: String, required: true, trim: true, uppercase: true },
  marks: { type: Number, required: true, min: 0, max: 100 }
}, { timestamps: true, versionKey: false });

studentSchema.index({ studentId: 1 }, { unique: true, name: "uq_student_id" });
studentSchema.index({ email: 1 }, { unique: true, name: "uq_student_email" });
studentSchema.index({ courseCode: 1, marks: -1 }, { name: "course_marks_desc" });
studentSchema.index({ department: 1, semester: 1 }, { name: "department_semester" });

module.exports = mongoose.model("Student", studentSchema);
