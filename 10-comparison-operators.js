// Part 04: Comparison Operators
// Demonstrates MongoDB comparison query operators.

use("sample02");

db.students.find({ marks: { $gt: 80 } });
db.students.find({ marks: { $gte: 85 } });
db.students.find({ marks: { $lt: 70 } });
db.students.find({ marks: { $lte: 70 } });
db.students.find({ marks: { $eq: 85 } });
db.students.find({ department: { $ne: "CSE" } });
db.students.find({ department: { $in: ["CSE", "AI"] } });
db.students.find({ department: { $nin: ["ECE", "ME"] } });
