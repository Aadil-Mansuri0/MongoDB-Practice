// Part 04: Comparison Operators

use("sample02");

// Marks greater than 80
db.students.find({ marks: { $gt: 80 } });

// Marks greater than or equal to 85
db.students.find({ marks: { $gte: 85 } });

// Marks less than 70
db.students.find({ marks: { $lt: 70 } });

// Marks less than or equal to 70
db.students.find({ marks: { $lte: 70 } });

// Marks equal to 85
db.students.find({ marks: { $eq: 85 } });

// Department not equal to CSE
db.students.find({ department: { $ne: "CSE" } });
