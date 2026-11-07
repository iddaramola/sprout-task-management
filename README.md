# Task Management Application

A full-stack task management application built with React, Node.js, Express.js, and PostgreSQL. The application allows users to create tasks, view existing tasks, filter tasks by status, and update task statuses.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Continuous Integration](#continuous-integration)
- [Validation and Error Handling](#validation-and-error-handling)
- [Design Decisions](#design-decisions)

## Project Overview

The Task Management Application provides the following functionality:

- Retrieve and display all tasks.
- Create new tasks with a title and optional description.
- Update the status of existing tasks.
- Filter tasks by status.
- Display loading, error, and empty states.
- Persist task data in PostgreSQL.
- Validate incoming API requests.
- Automatically run backend integration tests through GitHub Actions.

### Task Statuses

The application supports three task statuses:

- `Pending`
- `In Progress`
- `Completed`

New tasks are assigned the `Pending` status by default.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)
- Zod
- dotenv
- CORS

### Testing
- Mocha
- Supertest
- Node.js assertions

### DevOps
- Git and GitHub
- GitHub Actions

## Architecture

The application follows a modular monolithic architecture with a layered backend structure.

### Backend request flow

```text
Client
  |
  v
Express Routes
  |
  v
Validation Middleware
  |
  v
Controllers
  |
  v
Services
  |
  v
Repositories
  |
  v
PostgreSQL
```

### Layer responsibilities

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints and HTTP methods |
| Middleware | Validate requests and handle asynchronous errors |
| Controllers | Handle HTTP requests and responses |
| Services | Implement application business logic |
| Repositories | Execute database queries |
| Database | Persist task records |

The frontend uses a service layer to centralize API communication, while React components handle presentation and user interactions.

## Project Structure

```text
task-management/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── task.controller.js
│   │   ├── middleware/
│   │   │   ├── async-handler.js
│   │   │   ├── error-handler.js
│   │   │   └── validate.js
│   │   ├── repositories/
│   │   │   └── task.repository.js
│   │   ├── routes/
│   │   │   └── task.routes.js
│   │   ├── services/
│   │   │   └── task.service.js
│   │   ├── validators/
│   │   │   └── task.validator.js
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── test/
│   │   ├── setup.js
│   │   └── tasks.test.js
│   │
│   ├── .env
│   ├── .env.test
│   ├── .mocharc.json
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── services/
│   │   │   └── taskApi.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env.local
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

Install the following software:

- Node.js (version 22 or compatible LTS version)
- npm
- PostgreSQL
- Git
- A code editor such as Visual Studio Code

Verify your installations:

```bash
node -v
npm -v
git --version
psql --version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-management.git
cd task-management
```

Replace `YOUR_USERNAME` with the appropriate GitHub username.

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## Environment Configuration

The application uses environment variables to configure database connectivity and API communication.

### Backend configuration

Copy the root environment example into the backend directory as `.env`.

On Windows PowerShell:

```powershell
Copy-Item ..\.env.example .env
```

Update `backend/.env` with your PostgreSQL credentials:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=task_app
DB_PASSWORD=your_database_password

FRONTEND_URL=http://localhost:5173
```

### Frontend configuration

Create `frontend/.env.local` using `frontend/.env.example` as a reference.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Important:** Never commit `.env`, `.env.local`, or `.env.test` files. They contain environment-specific configuration and credentials.

## Database Setup

The application uses PostgreSQL.

### 1. Create the application database user

Connect to PostgreSQL as an administrator and execute:

```sql
CREATE ROLE task_app
WITH LOGIN
PASSWORD 'your_secure_password';
```

### 2. Create the development database

```sql
CREATE DATABASE task_management
OWNER task_app;
```

### 3. Create the database schema

From the project root:

```bash
psql -h localhost -p 5432 -U task_app -d task_management -f database/schema.sql
```

The schema creates the `tasks` table with the following fields:

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| title | VARCHAR(255) | Task title |
| description | TEXT | Optional task description |
| status | VARCHAR(20) | Task status |
| created_at | TIMESTAMPTZ | Record creation timestamp |

The database enforces constraints for non-empty titles and valid task statuses.

An index is also created on the `status` column to support status filtering.

### 4. Insert sample records (optional)

```bash
psql -h localhost -p 5432 -U task_app -d task_management -f database/seed.sql
```

The seed script inserts sample tasks. Run it only when you want to add those sample records; repeated execution inserts additional copies.

## Running the Application

The frontend and backend run independently.

### Start the backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/health
```

### Start the frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use the application.

## API Documentation

Base URL:

```text
http://localhost:5000/api
```

### 1. Retrieve all tasks

**Endpoint**

```http
GET /api/tasks
```

Returns all tasks ordered by creation date, newest first.

**Example response**

```json
{
  "success": true,
  "data": [
    {
      "id": "00000000-0000-4000-8000-000000000001",
      "title": "Complete assessment",
      "description": "Build the task management application",
      "status": "Pending",
      "created_at": "2026-11-07T10:00:00.000Z"
    }
  ]
}
```

### 2. Filter tasks by status

**Endpoint**

```http
GET /api/tasks?status=Pending
```

Supported values:

- `Pending`
- `In Progress`
- `Completed`

Invalid status values return HTTP `400 Bad Request`.

### 3. Create a task

**Endpoint**

```http
POST /api/tasks
```

**Request body**

```json
{
  "title": "Implement API tests",
  "description": "Write integration tests for task endpoints"
}
```

**Successful response**

HTTP `201 Created`

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "title": "Implement API tests",
    "description": "Write integration tests for task endpoints",
    "status": "Pending",
    "created_at": "2026-11-07T10:00:00.000Z"
  }
}
```

The status is assigned automatically as `Pending`.

### 4. Update task status

**Endpoint**

```http
PATCH /api/tasks/:id/status
```

**Example request**

```http
PATCH /api/tasks/00000000-0000-4000-8000-000000000001/status
```

**Request body**

```json
{
  "status": "Completed"
}
```

Supported statuses:

- `Pending`
- `In Progress`
- `Completed`

**Successful response**

HTTP `200 OK`

```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "title": "Implement API tests",
    "description": "Write integration tests for task endpoints",
    "status": "Completed",
    "created_at": "2026-11-07T10:00:00.000Z"
  }
}
```

### HTTP Status Codes

| Status code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request or validation failure |
| 404 | Resource or route not found |
| 500 | Internal server error |

## Running Tests

The backend uses Mocha and Supertest for integration testing.

Tests run against a separate PostgreSQL database to avoid modifying development data.

### 1. Create the test database

Connect to PostgreSQL as an administrator:

```sql
CREATE DATABASE task_management_test
OWNER task_app;
```

### 2. Apply the schema

From the project root:

```bash
psql -h localhost -p 5432 -U task_app -d task_management_test -f database/schema.sql
```

### 3. Configure test environment variables

Create `backend/.env.test`:

```env
PORT=5001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management_test
DB_USER=task_app
DB_PASSWORD=your_database_password

FRONTEND_URL=http://localhost:5173
```

### 4. Execute tests

From the backend directory:

```bash
npm test
```

The integration tests cover:

- Retrieving all tasks.
- Filtering tasks by status.
- Creating a task.
- Rejecting missing or invalid task data.
- Updating task status.
- Rejecting invalid status values.
- Handling invalid task IDs.
- Returning `404` when a task does not exist.

The test suite uses the real PostgreSQL database and cleans the test table before each test.

## Continuous Integration

GitHub Actions is configured to run backend integration tests automatically.

Workflow location:

```text
.github/workflows/ci.yml
```

The workflow executes on:

- Pushes to `main` or `master`.
- Pull requests targeting `main` or `master`.

### CI pipeline steps

1. Checks out the repository.
2. Sets up Node.js.
3. Installs dependencies using `npm ci`.
4. Starts a PostgreSQL service.
5. Applies the database schema.
6. Executes backend integration tests using Mocha.

The pipeline uses a separate PostgreSQL test database and does not require local database credentials.

## Validation and Error Handling

The backend uses Zod for request validation.

Validation includes:

- Required task title.
- Title trimming and maximum length of 255 characters.
- Description maximum length of 5,000 characters.
- Allowed task statuses.
- Valid UUID task identifiers.
- Rejection of unexpected request properties.

A centralized error-handling middleware provides consistent API error responses.

Asynchronous route errors are forwarded to the centralized error handler.

## Design Decisions

### 1. Modular monolith

The application uses a modular monolithic architecture rather than microservices.

This keeps deployment and development simple while maintaining clear separation of responsibilities.

### 2. Layered backend architecture

Routes, controllers, services, and repositories are separated to improve maintainability and testability.

### 3. PostgreSQL

PostgreSQL provides relational data persistence, UUID identifiers, database constraints, and indexing.

### 4. Parameterized SQL queries

Database queries use parameterized values to protect against SQL injection.

### 5. Request validation

Zod validates incoming data before it reaches the application business logic.

### 6. Separate test database

Automated tests use an isolated database to prevent test execution from modifying development records.

### 7. No unnecessary infrastructure

The assessment scope does not require authentication, microservices, message brokers, or container orchestration. These have intentionally been excluded to keep the implementation focused.

---

