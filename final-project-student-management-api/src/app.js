const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("combined"));

app.get("/", (_req, res) => res.json({
  name: "Student Management & Performance API",
  version: "1.0.0",
  health: "/api/health",
  routes: { students: "/api/students", courses: "/api/courses" }
}));

app.get("/api/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const state = mongoose.connection.readyState;
  res.status(state === 1 ? 200 : 503).json({
    status: state === 1 ? "ok" : "database_unavailable",
    database: states[state] || "unknown",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use((req, res) => res.status(404).json({ error: "Route not found", path: req.originalUrl }));

app.use((err, _req, res, _next) => {
  if (err && err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body" });
  if (err && err.name === "ValidationError") return res.status(400).json({
    error: "Validation failed", details: Object.values(err.errors).map(e => e.message)
  });
  if (err && err.name === "CastError") return res.status(400).json({ error: "Invalid field value" });
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ error: "Duplicate value for " + field });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
