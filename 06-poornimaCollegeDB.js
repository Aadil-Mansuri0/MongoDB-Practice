// MongoDB Practice 06 - Poornima College Student Database
// Requirements: database named after college, Student collection, at least 15 documents,
// embedded address object and skills array.

use poornimaCollegeDB

db.createCollection("Student")

db.Student.insertMany([
  { studentId: 101, name: "Aadil Mansuri", department: "CSE (AI)", graduationYear: 2028, cgpa: 9.57, address: { city: "Jaipur", state: "Rajasthan", pincode: 302018 }, skills: ["Python", "SQL", "MongoDB", "Machine Learning"] },
  { studentId: 102, name: "Rahul Sharma", department: "CSE", graduationYear: 2028, cgpa: 8.92, address: { city: "Jaipur", state: "Rajasthan", pincode: 302019 }, skills: ["Java", "C++", "DSA", "SQL"] },
  { studentId: 103, name: "Priya Gupta", department: "CSE (AI)", graduationYear: 2028, cgpa: 9.12, address: { city: "Delhi", state: "Delhi", pincode: 110001 }, skills: ["Python", "Machine Learning", "TensorFlow"] },
  { studentId: 104, name: "Aman Verma", department: "ECE", graduationYear: 2028, cgpa: 8.45, address: { city: "Kota", state: "Rajasthan", pincode: 324001 }, skills: ["C", "Embedded Systems", "Arduino"] },
  { studentId: 105, name: "Neha Singh", department: "IT", graduationYear: 2028, cgpa: 8.76, address: { city: "Lucknow", state: "Uttar Pradesh", pincode: 226001 }, skills: ["HTML", "CSS", "JavaScript", "React"] },
  { studentId: 106, name: "Rohit Meena", department: "CSE", graduationYear: 2028, cgpa: 8.68, address: { city: "Ajmer", state: "Rajasthan", pincode: 305001 }, skills: ["Python", "Django", "SQL"] },
  { studentId: 107, name: "Karan Joshi", department: "CSE (AI)", graduationYear: 2028, cgpa: 9.01, address: { city: "Udaipur", state: "Rajasthan", pincode: 313001 }, skills: ["Python", "Deep Learning", "OpenCV"] },
  { studentId: 108, name: "Simran Kaur", department: "IT", graduationYear: 2028, cgpa: 8.84, address: { city: "Amritsar", state: "Punjab", pincode: 143001 }, skills: ["Java", "SQL", "Spring Boot"] },
  { studentId: 109, name: "Vivek Kumar", department: "ME", graduationYear: 2028, cgpa: 8.21, address: { city: "Jaipur", state: "Rajasthan", pincode: 302020 }, skills: ["AutoCAD", "MATLAB", "SolidWorks"] },
  { studentId: 110, name: "Anjali Sharma", department: "CSE", graduationYear: 2028, cgpa: 9.25, address: { city: "Bhopal", state: "Madhya Pradesh", pincode: 462001 }, skills: ["C++", "DSA", "Python", "Git"] },
  { studentId: 111, name: "Mohit Saini", department: "ECE", graduationYear: 2028, cgpa: 8.53, address: { city: "Alwar", state: "Rajasthan", pincode: 301001 }, skills: ["IoT", "Arduino", "C++"] },
  { studentId: 112, name: "Sneha Patel", department: "CSE (AI)", graduationYear: 2028, cgpa: 9.08, address: { city: "Ahmedabad", state: "Gujarat", pincode: 380001 }, skills: ["Python", "AI", "NLP", "Machine Learning"] },
  { studentId: 113, name: "Arjun Yadav", department: "IT", graduationYear: 2028, cgpa: 8.67, address: { city: "Gurugram", state: "Haryana", pincode: 122001 }, skills: ["JavaScript", "Node.js", "MongoDB"] },
  { studentId: 114, name: "Pooja Verma", department: "CSE", graduationYear: 2028, cgpa: 9.18, address: { city: "Jaipur", state: "Rajasthan", pincode: 302021 }, skills: ["Python", "SQL", "Data Analysis", "Pandas"] },
  { studentId: 115, name: "Dev Sharma", department: "CSE (AI)", graduationYear: 2028, cgpa: 8.95, address: { city: "Jodhpur", state: "Rajasthan", pincode: 342001 }, skills: ["Python", "Scikit-learn", "FastAPI", "SQL"] }
])

db.Student.find().pretty()

db.Student.countDocuments()
