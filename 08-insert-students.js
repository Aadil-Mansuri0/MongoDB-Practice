// Part 02: Insert Student Documents

use("sample02");

db.students.insertMany([
  {
    rollNo: 1,
    name: "Aarav",
    age: 20,
    department: "CSE",
    marks: 85,
    skills: ["Python", "MongoDB"],
    address: { city: "Jaipur", state: "Rajasthan" },
    scholarship: true
  },
  {
    rollNo: 2,
    name: "Riya",
    age: 21,
    department: "ECE",
    marks: 78,
    skills: ["Java", "SQL"],
    address: { city: "Delhi", state: "Delhi" }
  },
  {
    rollNo: 3,
    name: "Karan",
    age: 20,
    department: "CSE",
    marks: 92,
    skills: ["C++", "Python"],
    address: { city: "Mumbai", state: "Maharashtra" },
    scholarship: true
  },
  {
    rollNo: 4,
    name: "Meera",
    age: 22,
    department: "ME",
    marks: 65,
    skills: ["AutoCAD", "Python"],
    address: { city: "Pune", state: "Maharashtra" }
  },
  {
    rollNo: 5,
    name: "Rahul",
    age: 21,
    department: "CSE",
    marks: 88,
    skills: ["JavaScript", "MongoDB"],
    address: { city: "Jaipur", state: "Rajasthan" }
  },
  {
    rollNo: 6,
    name: "Ananya",
    age: 20,
    department: "ECE",
    marks: 72,
    skills: ["C", "Python"],
    address: { city: "Chennai", state: "Tamil Nadu" }
  },
  {
    rollNo: 7,
    name: "Vivek",
    age: 22,
    department: "CSE",
    marks: 95,
    skills: ["Python", "SQL"],
    address: { city: "Kota", state: "Rajasthan" },
    scholarship: true
  },
  {
    rollNo: 8,
    name: "Neha",
    age: 21,
    department: "IT",
    marks: 68,
    skills: ["HTML", "CSS"],
    address: { city: "Ahmedabad", state: "Gujarat" }
  },
  {
    rollNo: 9,
    name: "Aditya",
    age: 20,
    department: "CSE",
    marks: 81,
    skills: ["Java", "SQL"],
    address: { city: "Jaipur", state: "Rajasthan" }
  },
  {
    rollNo: 10,
    name: "Pooja",
    age: 22,
    department: "ECE",
    marks: 85,
    skills: ["Python", "MATLAB"],
    address: { city: "Bhopal", state: "Madhya Pradesh" }
  },
  {
    rollNo: 11,
    name: "Sahil",
    age: 21,
    department: "CSE",
    marks: 76,
    skills: ["C++", "SQL"],
    address: { city: "Indore", state: "Madhya Pradesh" }
  },
  {
    rollNo: 12,
    name: "Ishita",
    age: 20,
    department: "IT",
    marks: 89,
    skills: ["Python", "JavaScript"],
    address: { city: "Chandigarh", state: "Chandigarh" },
    scholarship: true
  }
]);
