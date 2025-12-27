const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
const maintenanceRoutes = require("./routes/maintenance.routes");
app.use("/api/maintenance", maintenanceRoutes);

/* Health check */
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend working" });
});

/* Frontend fallback */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

