// MongoDB Practice 05 - Basic Database and Collection Operations

use mongoPracticeDB

db.createCollection("users")

db.users.insertMany([
  { user_id: 1, name: "Aadil", age: 20, skills: ["Python", "SQL"] },
  { user_id: 2, name: "Rahul", age: 21, skills: ["Java", "DSA"] },
  { user_id: 3, name: "Priya", age: 20, skills: ["Python", "AI"] },
  { user_id: 4, name: "Aman", age: 22, skills: ["C++", "MongoDB"] }
])

// Display all documents
db.users.find().pretty()

// Count documents
db.users.countDocuments()

// Find users with age 20
db.users.find({ age: 20 }).pretty()
