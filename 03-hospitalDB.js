// MongoDB Practice 03 - Hospital Database

use hospitalDB

db.createCollection("patients")

db.patients.insertMany([
  {
    patient_id: 301,
    name: "Ravi Kumar",
    age: 45,
    disease: "Diabetes",
    medicines: ["Metformin", "Insulin"],
    doctor: { name: "Dr. Mehta", department: "Medicine" }
  },
  {
    patient_id: 302,
    name: "Neha Sharma",
    age: 32,
    disease: "Asthma",
    medicines: ["Inhaler", "Montelukast"],
    doctor: { name: "Dr. Singh", department: "Pulmonology" }
  },
  {
    patient_id: 303,
    name: "Amit Jain",
    age: 51,
    disease: "Hypertension",
    medicines: ["Amlodipine"],
    doctor: { name: "Dr. Mehta", department: "Medicine" }
  },
  {
    patient_id: 304,
    name: "Pooja Verma",
    age: 28,
    disease: "Migraine",
    medicines: ["Sumatriptan"],
    doctor: { name: "Dr. Gupta", department: "Neurology" }
  }
])

db.patients.find().pretty()
