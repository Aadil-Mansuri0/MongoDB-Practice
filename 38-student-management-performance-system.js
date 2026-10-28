// ============================================================================
// PROJECT: Student Management & Performance System
// MongoDB Practice Repository - Part 38
// Database: StudentPerformanceDB
// Collections: students, courses
//
// Requirements covered:
// 1. Design students and courses collections.
// 2. Insert initial student and course records.
// 3. Update student marks.
// 4. Create indexes on the courses collection.
// 5. Use aggregation to calculate student count and average marks per course.
//
// Run using mongosh:
//   load("38-student-management-performance-system.js")
//
// Safety / rerun behavior:
// - Uses a dedicated practice database.
// - Uses stable IDs and updateOne(..., {upsert:true}) for seed data.
// - Does not drop collections or delete existing records.
// - Mark update and index creation can be rerun safely.
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
// STEP 1: CREATE COLLECTIONS
// ============================================================================
// Explicitly create collections if they do not already exist.
if (!studentDb.getCollectionNames().includes("students")) {
    studentDb.createCollection("students");
}
if (!studentDb.getCollectionNames().includes("courses")) {
    studentDb.createCollection("courses");
}

print("\n1. Collections ready:");
printjson(studentDb.getCollectionNames());

// ============================================================================
// STEP 2: INSERT INITIAL COURSE RECORDS
// ============================================================================
// courseCode is the stable key used to connect students with courses.
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

courseSeed.forEach(function (course) {
    courses.updateOne(
        { courseCode: course.courseCode },
        { $setOnInsert: course },
        { upsert: true }
    );
});

print("\n2. Course records:");
printjson(courses.find({}, { _id: 0 }).sort({ courseCode: 1 }).toArray());

// ============================================================================
// STEP 3: INSERT INITIAL STUDENT RECORDS
// ============================================================================
// Each student record stores one course enrollment and that course's marks.
// In a larger system with multiple courses per student, a separate enrollments
// collection (or an enrollment array) may be a better data model. This project
// intentionally stays with the two collections requested in the assignment.
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

studentSeed.forEach(function (student) {
    students.updateOne(
        { studentId: student.studentId },
        { $setOnInsert: student },
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
// STEP 4: VALIDATE RELATIONSHIPS
// ============================================================================
// Find students whose courseCode does not exist in courses.
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
// STEP 5: UPDATE STUDENT MARKS
// ============================================================================
// Example: update STU1003's marks. Re-running sets the same final value.
const marksUpdate = students.updateOne(
    { studentId: "STU1003" },
    {
        $set: {
            marks: 84,
            lastMarksUpdatedAt: new Date()
        }
    }
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
// STEP 6: CREATE INDEXES ON THE COURSES COLLECTION
// ============================================================================
// Unique index: ensures that every course has a distinct courseCode.
// Compound index: supports queries that filter by department and then sort
// by courseName. The field order matters for compound-index query patterns.
print("\n6. Create indexes on courses:");
print("Unique courseCode index:");
printjson(
    courses.createIndex(
        { courseCode: 1 },
        { unique: true, name: "courseCode_unique_idx" }
    )
);

print("Compound department + courseName index:");
printjson(
    courses.createIndex(
        { department: 1, courseName: 1 },
        { name: "department_courseName_idx" }
    )
);

print("Current course indexes:");
printjson(courses.getIndexes());

// Example query that can use the compound index.
print("\nExample: courses in Computer Science, sorted by course name:");
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
// STEP 7: AGGREGATION - TOTAL STUDENTS AND AVERAGE MARKS PER COURSE
// ============================================================================
// Start from courses and $lookup matching students. This approach also keeps
// courses with zero enrolled students in the output (count 0, average null).
// The average is calculated from the students' marks after the update above.
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
    {
        $sort: { courseCode: 1 }
    }
]).toArray();

printjson(coursePerformance);

// ============================================================================
// STEP 8: OPTIONAL OVERALL SUMMARY
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
        { $project: { _id: 0, averageMarks: 1, minimumMarks: 1, maximumMarks: 1 } }
    ]).toArray()[0] || null
});

// ============================================================================
// STEP 9: QUICK MANUAL QUERIES
// ============================================================================
// Uncomment and run individually if you want to practise:
//
// students.find({ marks: { $gte: 85 } }, { _id: 0 }).sort({ marks: -1 });
// courses.find({ department: "Computer Science" }).sort({ courseName: 1 });
// students.find({ courseCode: "CS101" }, { _id: 0, name: 1, marks: 1 });
// students.updateOne({ studentId: "STU1001" }, { $inc: { marks: 1 } });
//
// EXPECTED COURSE-WISE RESULT AFTER THE UPDATE:
// CS101 -> 2 students; average marks = (86 + 91) / 2 = 88.5
// CS102 -> 2 students; average marks = (84 + 88) / 2 = 86
// AI201 -> 2 students; average marks = (95 + 82) / 2 = 88.5
//
// Note: The script does not delete or recreate collections. If you manually
// change seed records, the expected averages will naturally change.

print("\n============================================================");
print("PROJECT COMPLETED");
print("Database: StudentPerformanceDB");
print("Collections: students, courses");
print("Topics: CRUD, update, indexes, explain, $lookup, $avg, $size, $sort");
print("============================================================");
