# Note-Taking API

A RESTful API for a note-taking application built with Node.js, Express, TypeScript, and MongoDB.

## Live API

[Live API](https://note-taking-api-03r0.onrender.com)

## API Documentation

Full documentation with request/response examples:
(https://documenter.getpostman.com/view/39328624/2sBXwqrAY6)

---

## The Tasks

### Task 11 — Basic REST API

- Set up a basic Express server with TypeScript configuration
- Create proper interfaces for data models
- Use MongoDB's Mongoose to store notes (id, title, content, createdAt, updatedAt)
- Create endpoints for listing, fetching, creating, and deleting notes
- Add basic error handling with typed custom error classes
- Test the API with Postman

### Task 12 — Categories & Type Safety

- Create a Category interface and add it to the Note interface
- Add a category field to each note with proper type validation
- Create new endpoints for getting notes by category
- Add validation for the note format using a custom middleware with TypeScript generics
- Create a typed logging middleware to track API requests

### Task 13 — User Authentication

- Create User and Auth interfaces for type safety
- Add a user system with registration and login using typed controllers
- Hash passwords using bcrypt during registration
- Implement JWT authentication with typed payloads for protected routes
- Associate notes with specific users using TypeScript type relationships
- Modify existing endpoints to only show/modify notes belonging to the authenticated user
- Add `POST /api/auth/register` and `POST /api/auth/login` endpoints
- Create a custom type guard for user authentication

---

## What I Added Beyond the Tasks

| Feature                         | Why I Added It                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Full-text search**            | `?search=keyword` searches across note title and content using a MongoDB text index                |
| **Pagination**                  | `?page=1&limit=10` on note listing so the API scales with large datasets                           |
| **Sorting**                     | `?sort=-createdAt` supports any field, prefix with `-` for descending order                        |
| **Category filtering**          | `?category=<id>` filters notes by category on the main listing endpoint                            |
| **Soft delete / Archive**       | Notes are archived instead of permanently deleted, so data is never lost                           |
| **Restore endpoint**            | Archived notes can be restored via `PUT /api/notes/:id/restore`                                    |
| **Archived notes listing**      | `GET /api/notes/archived` lets users view and manage their archived notes                          |
| **Duplicate category check**    | Prevents a user from creating two categories with the same name                                    |
| **Security: vague login error** | Login returns the same error for wrong email or wrong password to avoid exposing registered emails |

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JSON Web Tokens (JWT) + bcrypt
- **Config:** dotenv

---

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a MongoDB Atlas URI)

### Installation

1. Clone the repository

```bash
git clone https://github.com/Lichi-fave/Note-taking-api.git
cd Note-taking-api
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root folder:

```env
PORT=
MONGODB_URI=
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
```

4. Run the development server

```bash
npm run dev
```

You should see:

```text
Connected to MongoDB
Server is running on port 3000
```

---

## API Endpoints

All `/api/notes` and `/api/categories` routes are **protected** — include your JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_token>
```

### Auth (Public)

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| POST   | `/api/auth/register` | Register a new user           |
| POST   | `/api/auth/login`    | Login and receive a JWT token |

### Notes (Protected)

| Method | Endpoint                          | Description                                               |
| ------ | --------------------------------- | --------------------------------------------------------- |
| GET    | `/api/notes`                      | Get all notes (supports search, filter, sort, pagination) |
| GET    | `/api/notes/archived`             | Get all archived notes                                    |
| GET    | `/api/notes/category/:categoryId` | Get notes by category                                     |
| GET    | `/api/notes/:id`                  | Get a specific note by ID                                 |
| POST   | `/api/notes`                      | Create a new note                                         |
| PUT    | `/api/notes/:id`                  | Update an existing note                                   |
| PUT    | `/api/notes/:id/restore`          | Restore an archived note                                  |
| DELETE | `/api/notes/:id`                  | Archive a note (soft delete)                              |

### Query Parameters for `GET /api/notes`

| Parameter  | Example            | Description                                  |
| ---------- | ------------------ | -------------------------------------------- |
| `search`   | `?search=first`    | Full-text search on title and content        |
| `category` | `?category=<id>`   | Filter by category ID                        |
| `sort`     | `?sort=-createdAt` | Sort by any field; prefix `-` for descending |
| `page`     | `?page=2`          | Page number (default: 1)                     |
| `limit`    | `?limit=10`        | Results per page (default: 10, max: 20)      |

### Categories (Protected)

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/api/categories` | Get all categories    |
| POST   | `/api/categories` | Create a new category |

---

## Project Structure

```text
Note-taking-api/
├── src/
│   ├── controller/
│   │   ├── authController.ts
│   │   ├── categoryController.ts
│   │   └── noteController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │   └── validate.ts
│   ├── model/
│   │   ├── categoryModel.ts
│   │   ├── noteModel.ts
│   │   └── userModel.ts
│   ├── app.ts
│   ├── constants.ts
│   ├── database.ts
│   └── errors.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

---

## Validation Rules

| Field                | Rule                                               |
| -------------------- | -------------------------------------------------- |
| Title                | 3–100 characters, required                         |
| Content              | Minimum 5 characters, required                     |
| Category name        | 2–50 characters, required, must be unique per user |
| Category description | Minimum 5 characters, required                     |
| Password             | Minimum 8 characters, required                     |
| Email                | Valid email format, must be unique                 |

---

## Author

Built by Oluchukwu Anakor as part of a backend development learning program under Genesys Tech Hub.
