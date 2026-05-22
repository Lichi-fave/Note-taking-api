# Note-Taking API

A REST API for a note-taking application built with Node.js, Express, TypeScript, and MongoDB.

---

## The Task

Build a basic REST API for a note-taking application with the following requirements:

- Set up a basic Express server with TypeScript configuration
- Create proper interfaces for data models
- Use MongoDB's Mongoose to store notes (id, title, content, createdAt, updatedAt)
- Create endpoints for listing, fetching, creating, and deleting notes
- Add basic error handling with typed custom error classes
- Test the API with Postman

---

## What I Added Beyond the Task

| Feature                    | Why I Added It                                                                |
| -------------------------- | ----------------------------------------------------------------------------- |
| **PUT endpoint**           | Completes full CRUD Application                                               |
| **Regex input validation** | Validates that title and content meet quality rules, not just that they exist |

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Config:** dotenv

---

## Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)

### Installation

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/note-taking-api.git
cd notes-api
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root folder:

```
PORT=
MONGODB_URI=
```

4. Run the development server

```bash
npm run dev
```

You should see:

```
Connected to MongoDB
Server running on port 3000
```

---

## API Endpoints

### Notes

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/notes`     | Get all notes             |
| GET    | `/api/notes/:id` | Get a specific note by ID |
| POST   | `/api/notes`     | Create a new note         |
| PUT    | `/api/notes/:id` | Update an existing note   |
| DELETE | `/api/notes/:id` | Delete a note             |

---

## Request & Response Examples

### Create a Note

**POST** `/api/notes`

```json
// Request body
{
  "title": "This is my first note",
  "content": "Hello World!"
}

// Response (201 Created)
{
    "_id":"6a1070f6e29af2184e06284f",
    "title":"This is my first note",
    "content":"Hello World!",
    "createdAt":"2026-05-22T15:06:30.204Z",
    "updatedAt":"2026-05-22T15:06:30.204Z",
    "__v":0
}
```

---

## Project Structure

```
note-taking-api/
├── src/
│   ├── app.ts            # Express server setup and routes
│   ├── constants.ts      # HTTP status codes
│   ├── controller.ts     # Endpoint logic
│   ├── database.ts       # MongoDB connection
│   ├── errors.ts         # Custom AppError class
│   └── NoteModels.ts     # INote interface and Mongoose schema
├── .env                  # Secret config (never pushed to GitHub)
├── .env.example
├── .gitignore            # Files excluded from GitHub
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Validation Rules (Regex)

| Field   | Rule                                                     |
| ------- | -------------------------------------------------------- |
| Title   | 3–100 characters, letters/numbers/basic punctuation only |
| Content | 5–1,000 characters, any characters allowed               |

---

## Author

Built by Oluchukwu Anakor as part of a backend development learning program under Genesys Tech Hub.
