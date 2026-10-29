const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

test("Student Management API integration", async t => {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const Student = require("../src/models/Student");
  const Course = require("../src/models/Course");
  await Course.create({ courseCode: "CS101", courseName: "Database Systems", department: "Computer Science", credits: 4, instructor: "Dr. Sharma" });
  await t.after(async () => { await mongoose.disconnect(); await mongo.stop(); });

  await t.test("health check", async () => {
    const r = await request(app).get("/api/health");
    assert.equal(r.status, 200);
    assert.equal(r.body.status, "ok");
  });
  await t.test("create and read student", async () => {
    const r = await request(app).post("/api/students").send({
      studentId: "STU1001", name: "Aarav Sharma", email: "aarav@example.com",
      semester: 3, department: "Computer Science", courseCode: "CS101", marks: 86
    });
    assert.equal(r.status, 201);
    assert.equal((await request(app).get("/api/students/STU1001")).body.data.marks, 86);
  });
  await t.test("reject duplicate identifier", async () => {
    const r = await request(app).post("/api/students").send({
      studentId: "STU1001", name: "Duplicate Student", email: "other@example.com",
      semester: 3, department: "Computer Science", courseCode: "CS101", marks: 75
    });
    assert.equal(r.status, 409);
  });
  await t.test("update and validate marks", async () => {
    assert.equal((await request(app).patch("/api/students/STU1001").send({ marks: 93 })).body.data.marks, 93);
    assert.equal((await request(app).patch("/api/students/STU1001").send({ marks: 120 })).status, 400);
  });
  await t.test("filter and aggregate", async () => {
    const list = await request(app).get("/api/students?courseCode=CS101");
    assert.equal(list.body.pagination.total, 1);
    const stats = await request(app).get("/api/students/stats/by-course");
    assert.equal(stats.body.data[0].averageMarks, 93);
  });
  await t.test("delete student", async () => {
    assert.equal((await request(app).delete("/api/students/STU1001")).status, 204);
    assert.equal(await Student.countDocuments({ studentId: "STU1001" }), 0);
  });
});
