require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("../src/models/Student");
const Course = require("../src/models/Course");

const courses = [
  { courseCode: "CS101", courseName: "Database Management Systems", department: "Computer Science", credits: 4, instructor: "Dr. Sharma" },
  { courseCode: "CS102", courseName: "Data Structures and Algorithms", department: "Computer Science", credits: 4, instructor: "Prof. Mehta" },
  { courseCode: "AI201", courseName: "Introduction to Artificial Intelligence", department: "Artificial Intelligence", credits: 3, instructor: "Dr. Verma" }
];
const students = [
  { studentId: "STU1001", name: "Aarav Sharma", email: "aarav.sharma@example.com", semester: 3, department: "Computer Science", courseCode: "CS101", marks: 86 },
  { studentId: "STU1002", name: "Diya Mehta", email: "diya.mehta@example.com", semester: 3, department: "Computer Science", courseCode: "CS101", marks: 91 },
  { studentId: "STU1003", name: "Kabir Verma", email: "kabir.verma@example.com", semester: 3, department: "Computer Science", courseCode: "CS102", marks: 84 },
  { studentId: "STU1004", name: "Anaya Singh", email: "anaya.singh@example.com", semester: 3, department: "Computer Science", courseCode: "CS102", marks: 88 },
  { studentId: "STU1005", name: "Vivaan Patel", email: "vivaan.patel@example.com", semester: 3, department: "Artificial Intelligence", courseCode: "AI201", marks: 95 },
  { studentId: "STU1006", name: "Sara Khan", email: "sara.khan@example.com", semester: 3, department: "Artificial Intelligence", courseCode: "AI201", marks: 82 }
];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    for (const course of courses) await Course.updateOne({ courseCode: course.courseCode }, { $set: course }, { upsert: true });
    for (const student of students) await Student.updateOne({ studentId: student.studentId }, { $set: student }, { upsert: true });
    console.log("Seed complete: " + await Course.countDocuments() + " courses, " + await Student.countDocuments() + " students");
  } finally { await mongoose.disconnect(); }
}
seed().catch(err => { console.error(err); process.exitCode = 1; });
