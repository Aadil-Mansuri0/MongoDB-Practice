// MongoDB Practice 01 - Student Database

use studentDB

db.createCollection("students")

db.students.insertMany([
  {
    student_id: 101,
    student_name: "Aadil Mansuri",
    age: 20,
    department: "CSE (AI)",
    skills: ["Python", "SQL", "MongoDB"],
    address: { city: "Jaipur", state: "Rajasthan" }
  },
  {
    student_id: 102,
    student_name: "Rahul Sharma",
    age: 21,
    department: "CSE",
    skills: ["Java", "C++", "DSA"],
    address: { city: "Jaipur", state: "Rajasthan" }
  },
  {
    student_id: 103,
    student_name: "Priya Gupta",
    age: 20,
    department: "IT",
    skills: ["Python", "HTML", "CSS"],
    address: { city: "Delhi", state: "Delhi" }
  },
  {
    student_id: 104,
    student_name: "Aman Verma",
    age: 21,
    department: "ECE",
    skills: ["C", "Arduino", "IoT"],
    address: { city: "Kota", state: "Rajasthan" }
  }
])

db.students.find().pretty()
