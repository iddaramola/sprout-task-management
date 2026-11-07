import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
  override: true,
});

if (process.env.DB_NAME !== "task_management_test") {
  throw new Error(
    "Tests must run against task_management_test. Check backend/.env.test."
  );
}