require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required; configure it in .env");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: process.env.NODE_ENV !== "production"
  });
  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => console.log("API listening on port " + port));
  const shutdown = async signal => {
    console.log(signal + " received; shutting down");
    server.close(async () => { await mongoose.disconnect(); process.exit(0); });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
start().catch(err => { console.error("Startup failed:", err.message); process.exit(1); });
