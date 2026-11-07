import { after, beforeEach, describe, it } from "mocha";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";
import { pool } from "../src/config/db.js";

const nonexistentId = "00000000-0000-4000-8000-000000000000";

describe("Task API", function () {
  beforeEach(async function () {
    await pool.query("TRUNCATE TABLE tasks");
  });

  after(async function () {
    await pool.end();
  });

  describe("GET /api/tasks", function () {
    it("should return all tasks", async function () {
      await pool.query(
        `INSERT INTO tasks (title, description)
         VALUES ($1, $2), ($3, $4)`,
        [
          "First task",
          "First description",
          "Second task",
          "Second description",
        ]
      );

      const response = await request(app)
        .get("/api/tasks");

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.length, 2);
    });

    it("should filter tasks by status", async function () {
      await pool.query(
        `INSERT INTO tasks (title, status)
         VALUES ($1, $2), ($3, $4)`,
        ["Pending task", "Pending", "Completed task", "Completed"]
      );

      const response = await request(app)
        .get("/api/tasks")
        .query({ status: "Pending" });

      assert.equal(response.status, 200);
      assert.equal(response.body.data.length, 1);
      assert.equal(response.body.data[0].status, "Pending");
    });

    it("should reject an invalid status filter", async function () {
      const response = await request(app)
        .get("/api/tasks")
        .query({ status: "Started" });

      assert.equal(response.status, 400);
      assert.equal(response.body.success, false);
    });
  });

  describe("POST /api/tasks", function () {
    it("should create a task with Pending as its default status", async function () {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Write automated tests",
          description: "Test the task creation endpoint",
        });

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.title, "Write automated tests");
      assert.equal(response.body.data.status, "Pending");
      assert.ok(response.body.data.id);
      assert.ok(response.body.data.created_at);
    });

    it("should reject a missing title", async function () {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          description: "A task without a title",
        });

      assert.equal(response.status, 400);
    });

    it("should reject an empty or whitespace-only title", async function () {
      for (const title of ["", "   "]) {
        const response = await request(app)
          .post("/api/tasks")
          .send({ title });

        assert.equal(response.status, 400);
      }
    });

    it("should reject a title longer than 255 characters", async function () {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "a".repeat(256),
        });

      assert.equal(response.status, 400);
    });

    it("should reject unexpected request properties", async function () {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Valid task",
          status: "Completed",
        });

      assert.equal(response.status, 400);
    });
  });

  describe("PATCH /api/tasks/:id/status", function () {
    it("should update an existing task's status", async function () {
      const insertResult = await pool.query(
        `INSERT INTO tasks (title)
         VALUES ($1)
         RETURNING id`,
        ["Task to update"]
      );

      const taskId = insertResult.rows[0].id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .send({ status: "Completed" });

      assert.equal(response.status, 200);
      assert.equal(response.body.data.id, taskId);
      assert.equal(response.body.data.status, "Completed");
    });

    it("should reject an invalid status", async function () {
      const response = await request(app)
        .patch(`/api/tasks/${nonexistentId}/status`)
        .send({ status: "Started" });

      assert.equal(response.status, 400);
    });

    it("should reject an invalid task ID", async function () {
      const response = await request(app)
        .patch("/api/tasks/not-a-uuid/status")
        .send({ status: "Completed" });

      assert.equal(response.status, 400);
    });

    it("should return 404 when the task does not exist", async function () {
      const response = await request(app)
        .patch(`/api/tasks/${nonexistentId}/status`)
        .send({ status: "Completed" });

      assert.equal(response.status, 404);
      assert.equal(response.body.message, "Task not found");
    });
  });
});