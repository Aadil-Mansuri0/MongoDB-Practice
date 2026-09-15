// Part 05: Logical Operators

use("sample02");

// $and: CSE students AND marks greater than 80
db.students.find({
  $and: [
    { department: "CSE" },
    { marks: { $gt: 80 } }
  ]
});

// $or: CSE students OR ECE students
db.students.find({
  $or: [
    { department: "CSE" },
    { department: "ECE" }
  ]
});

// $not: marks are NOT greater than 80
db.students.find({
  marks: { $not: { $gt: 80 } }
});

// $nor: neither CSE nor ECE
db.students.find({
  $nor: [
    { department: "CSE" },
    { department: "ECE" }
  ]
});
