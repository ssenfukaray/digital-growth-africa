const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const auditLeadRoutes = require("./routes/auditLeadRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// --- Root ---
app.get("/", (req, res) => {
  res.json({ message: "Digital Growth Africa API is running" });
});

// --- Keep-Alive Ping ---
// Lightweight endpoint for the cron job. No DB call. Just proves the process is alive.
app.get("/api/ping", (req, res) => {
  res.status(200).json({
    status: "alive",
    service: "digital-growth-africa-api",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/audit-leads", auditLeadRoutes);
app.use("/api/ai", aiRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[DGA] Server running on port ${PORT}`);
  console.log(`[DGA] Keep-alive ping: /api/ping`);
});
