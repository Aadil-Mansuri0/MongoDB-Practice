// ============================================================================
// PROJECT: Student Management & Performance System
// MongoDB Practice Repository - Part 38
// Database: StudentPerformanceDB
// Collections: students, courses
//
// Concepts: collections, upsert, CRUD, $lookup, aggregation, indexes,
// explain("executionStats"), data validation, and course-wise performance.
//
// Run from mongosh:
//   load("38-student-management-performance-system.js")
//
// SAFETY / RERUN BEHAVIOR:
// - Uses the dedicated StudentPerformanceDB practice database.
// - Does not drop collections or delete documents.
// - Upserts the six project student IDs and three course codes using $set,
//   so rerunning this script also corrects the project's sample fields.
// - STU1003's final marks are set to 84 on every run.
// - Index creation is repeatable.
// ============================================================================

const studentDb = db.getSiblingDB("StudentPerformanceDB");
const students = studentDb.getCollection("students");
const courses = studentDb.getCollection("courses");

print("\n============================================================");
print("STUDENT MANAGEMENT & PERFORMANCE SYSTEM");
print("============================================================");
print("Database: " + studentDb.getName());
print("Collections: students, courses");

// ============================================================================
// STEP 1: CREATE COLLECTIONS IF NEEDED
// ============================================================================
if (!studentDb.getCollectionNames().includes("students")) {
    studentDb.createCollection("students");
}
if (!studentDb.getCollectionNames().includes("courses")) {
    studentDb.createCollection("courses");
}

print("\n1. Collections ready:");
printjson(studentDb.getCollectionNames().filter(function (name) {
    return name === "students" || name === "courses";
}).sort());

// ============================================================================
// STEP 2: SEED COURSE RECORDS
// ============================================================================
const courseSeed = [
    {
        courseCode: "CS101",
        courseName: "Database Management Systems",
        department: "Computer Science",
        credits: 4,
        instructor: "Dr. Sharma"
    },
    {
        courseCode: "CS102",
        courseName: "Data Structures and Algorithms",
        department: "Computer Science",
        credits: 4,
        instructor: "Prof. Mehta"
    },
    {
        courseCode: "AI201",
        courseName: "Introduction to Artificial Intelligence",
        department: "Artificial Intelligence",
        credits: 3,
        instructor: "Dr. Verma"
    }
];

// $set makes the sample records consistent even if an earlier practice run
// inserted incomplete or different sample fields for these same course codes.
courseSeed.forEach(function (course) {
    courses.updateOne(
        { courseCode: course.courseCode },
        { $set: course },
        { upsert: true }
    );
});

print("\n2. Course records:");
printjson(courses.find({}, { _id: 0 }).sort({ courseCode: 1 }).toArray());

// ============================================================================
// STEP 3: SEED STUDENT RECORDS
// ============================================================================
const studentSeed = [
    {
        studentId: "STU1001",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        semester: 3,
        courseCode: "CS101",
        marks: 86
    },
    {
        studentId: "STU1002",
        name: "Diya Mehta",
        email: "diya.mehta@example.com",
        semester: 3,
        courseCode: "CS101",
        marks: 91
    },
    {
        studentId: "STU1003",
        name: "Kabir Verma",
        email: "kabir.verma@example.com",
        semester: 3,
        courseCode: "CS102",
        marks: 78
    },
    {
        studentId: "STU1004",
        name: "Anaya Singh",
        email: "anaya.singh@example.com",
        semester: 3,
        courseCode: "CS102",
        marks: 88
    },
    {
        studentId: "STU1005",
        name: "Vivaan Patel",
        email: "vivaan.patel@example.com",
        semester: 3,
        courseCode: "AI201",
        marks: 95
    },
    {
        studentId: "STU1006",
        name: "Sara Khan",
        email: "sara.khan@example.com",
        semester: 3,
        courseCode: "AI201",
        marks: 82
    }
];

// $set updates only the listed sample fields; it does not replace whole documents.
studentSeed.forEach(function (student) {
    students.updateOne(
        { studentId: student.studentId },
        { $set: student },
        { upsert: true }
    );
});

print("\n3. Student records:");
printjson(
    students.find({}, { _id: 0 })
        .sort({ studentId: 1 })
        .toArray()
);

// ============================================================================
// STEP 4: VALIDATE STUDENT-TO-COURSE REFERENCES
// ============================================================================
print("\n4. Students referencing a missing course (expected: empty array):");
printjson(
    students.aggregate([
        {
            $lookup: {
                from: "courses",
                localField: "courseCode",
                foreignField: "courseCode",
                as: "courseMatch"
            }
        },
        { $match: { courseMatch: { $eq: [] } } },
        { $project: { _id: 0, studentId: 1, name: 1, courseCode: 1 } }
    ]).toArray()
);

// ============================================================================
// STEP 5: UPDATE MARKS
// ============================================================================
const marksUpdate = students.updateOne(
    { studentId: "STU1003" },
    { $set: { marks: 84, lastMarksUpdatedAt: new Date() } }
);

print("\n5. Marks update result for STU1003:");
printjson(marksUpdate);
print("Updated student:");
printjson(
    students.findOne(
        { studentId: "STU1003" },
        { _id: 0, studentId: 1, name: 1, courseCode: 1, marks: 1, lastMarksUpdatedAt: 1 }
    )
);

// ============================================================================
// STEP 6: CREATE COURSE INDEXES
// ============================================================================
print("\n6. Create indexes on courses:");
print("Unique courseCode index:");
printjson(courses.createIndex({ courseCode: 1 }, { unique: true }));

print("Compound department + courseName index:");
printjson(courses.createIndex({ department: 1, courseName: 1 }));

print("Current course indexes:");
printjson(courses.getIndexes());

print("\nExample: Computer Science courses sorted by course name:");
printjson(
    courses.find(
        { department: "Computer Science" },
        { _id: 0, courseCode: 1, courseName: 1, department: 1 }
    ).sort({ courseName: 1 }).toArray()
);

print("\nQuery plan for the department/course-name query:");
printjson(
    courses.find({ department: "Computer Science" })
        .sort({ courseName: 1 })
        .explain("executionStats")
);

// ============================================================================
// STEP 7: COURSE-WISE STUDENT COUNT AND AVERAGE MARKS
// ============================================================================
print("\n7. Course-wise student count and average marks:");
const coursePerformance = courses.aggregate([
    {
        $lookup: {
            from: "students",
            localField: "courseCode",
            foreignField: "courseCode",
            as: "enrolledStudents"
        }
    },
    {
        $project: {
            _id: 0,
            courseCode: 1,
            courseName: 1,
            department: 1,
            totalStudents: { $size: "$enrolledStudents" },
            averageMarks: { $avg: "$enrolledStudents.marks" }
        }
    },
    { $sort: { courseCode: 1 } }
]).toArray();

printjson(coursePerformance);

// ============================================================================
// STEP 8: OVERALL STUDENT SUMMARY
// ============================================================================
print("\n8. Overall student summary:");
printjson({
    totalStudentRecords: students.countDocuments({}),
    totalCourses: courses.countDocuments({}),
    averageMarksAcrossStudents: students.aggregate([
        {
            $group: {
                _id: null,
                averageMarks: { $avg: "$marks" },
                minimumMarks: { $min: "$marks" },
                maximumMarks: { $max: "$marks" }
            }
        },
        {
            $project: {
                _id: 0,
                averageMarks: 1,
                minimumMarks: 1,
                maximumMarks: 1
            }
        }
    ]).toArray()[0] || null
});

// ============================================================================
// STEP 9: DATA QUALITY CHECKS
// ============================================================================
print("\n9. Students missing a required field (expected: 0):");
print(students.countDocuments({
    $or: [
        { studentId: { $exists: false } },
        { courseCode: { $exists: false } },
        { marks: { $exists: false } }
    ]
}));

print("\nStudents with a course reference that does not exist (expected: 0):");
print(students.aggregate([
    {
        $lookup: {
            from: "courses",
            localField: "courseCode",
            foreignField: "courseCode",
            as: "courseMatch"
        }
    },
    { $match: { courseMatch: { $eq: [] } } },
    { $count: "studentsWithMissingCourse" }
]).toArray());

// ============================================================================
// STEP 10: OPTIONAL MANUAL PRACTICE QUERIES
// ============================================================================
/*
// Students with marks >= 85:
students.find({ marks: { $gte: 85 } }, { _id: 0 }).sort({ marks: -1 });

// Courses in Computer Science:
courses.find({ department: "Computer Science" }).sort({ courseName: 1 });

// Students enrolled in CS101:
students.find(
    { courseCode: "CS101" },
    { _id: 0, name: 1, marks: 1 }
).sort({ name: 1 });
*/

// Expected course-wise results after the marks update:
// CS101 -> 2 students; average marks = (86 + 91) / 2 = 88.5
// CS102 -> 2 students; average marks = (84 + 88) / 2 = 86
// AI201 -> 2 students; average marks = (95 + 82) / 2 = 88.5

print("\n============================================================");
print("PROJECT COMPLETED");
print("Database: StudentPerformanceDB");
print("Collections: students, courses");
print("Topics: CRUD, upsert, indexes, explain, $lookup, $avg, $size, $sort");
print("============================================================");
