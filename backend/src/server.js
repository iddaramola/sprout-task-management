import "dotenv/config";
import app from "./app.js";
import { pool } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connection established");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    async function shutdown(signal) {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        await pool.end();
        console.log("Server and database pool closed");
        process.exit(0);
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error("Application startup failed:", error.message);
    await pool.end();
    process.exit(1);
  }
}

startServer();