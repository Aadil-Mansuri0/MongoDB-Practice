// MongoDB Practice 04 - Employee Database

use employeeDB

db.createCollection("employees")

db.employees.insertMany([
  {
    employee_id: 401,
    name: "Aarav Sharma",
    department: "IT",
    salary: 65000,
    skills: ["Python", "SQL", "Git"],
    contact: { city: "Jaipur", state: "Rajasthan" }
  },
  {
    employee_id: 402,
    name: "Ananya Gupta",
    department: "HR",
    salary: 58000,
    skills: ["Recruitment", "Communication"],
    contact: { city: "Delhi", state: "Delhi" }
  },
  {
    employee_id: 403,
    name: "Vikram Singh",
    department: "Finance",
    salary: 72000,
    skills: ["Excel", "Accounting", "SQL"],
    contact: { city: "Mumbai", state: "Maharashtra" }
  },
  {
    employee_id: 404,
    name: "Kavya Mehta",
    department: "IT",
    salary: 70000,
    skills: ["Java", "Spring Boot", "MongoDB"],
    contact: { city: "Jaipur", state: "Rajasthan" }
  }
])

db.employees.find().pretty()
