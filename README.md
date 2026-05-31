# Note-Taking API

A RESTful API for a note-taking application built with Node.js, Express, TypeScript, and MongoDB.

---

## The Task

### Task 11

Build a basic REST API for a note-taking application with the following requirements:

- Set up a basic Express server with TypeScript configuration
- Create proper interfaces for data models
- Use MongoDB's Mongoose to store notes (id, title, content, createdAt, updatedAt)
- Create endpoints for listing, fetching, creating, and deleting notes
- Add basic error handling with typed custom error classes
- Test the API with Postman

### Task 12

Extend note-taking API with categories and type-safety

- Create a Category interface and add it to the Note interface
- Add a category field to each note with proper type validation
- Create new endpoints for getting notes by category
- Add validation for the note format using a custom middleware with TypeScript generics
- Create a typed logging middleware to track API requests

---

## What I Added Beyond the Task

## What I Added Beyond the Task

| Feature                    | Why I Added It                                                                |
| -------------------------- | ----------------------------------------------------------------------------- |
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

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| GET    | `/api/notes`                      | Get all notes             |
| GET    | `/api/notes/:id`                  | Get a specific note by ID |
| GET    | `/api/notes/category/:categoryId` | Get notes by category     |
| POST   | `/api/notes`                      | Create a new note         |
| PUT    | `/api/notes/:id`                  | Update an existing note   |
| DELETE | `/api/notes/:id`                  | Delete a note             |

### Categories

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/api/categories` | Get all categories    |
| POST   | `/api/categories` | Create a new category |

---

## Request & Response Examples

### Create a Category

**POST** `/api/categories`

```json
 // Request body
 {
  "name":"Personal",
  "description":"Personal related notes"
 }

 // Response (201 Created)
 {
  "name":"Personal",
  "description":"Personal related notes",
  "_id":"6a1c27d1367679ca6d51722a",
  "createdAt":"2026-05-31T12:21:37.877Z",
  "updatedAt":"2026-05-31T12:21:37.877Z",
  "__v":0
 }
```

### Create a Note

**POST** `/api/notes`

```json
// Request body
{
  "title": "Note-taking API",
  "content": "Building a note-taking API",
  "category": "6a1c27d1367679ca6d51722a"
}

// Response (201 Created)
{
  "title":"Note-taking API",
  "content":"Building a note-taking API",
  "category":{
    "_id":"6a1c27d1367679ca6d51722a",
    "name":"Personal"},
  "_id":"6a1c3097cf5bb7e79fe75454",
  "createdAt":"2026-05-31T12:59:03.365Z",
  "updatedAt":"2026-05-31T12:59:03.365Z",
  "__v":0
}
```

---

## Project Structure

```
note-taking-api/
├── src/
│   ├──── controller/
│   │  ├──── categoryController.ts
│   │  └──── noteController.ts
│   ├──── middleware/
│   │  ├──── logger.ts
│   │  └──── validate.ts
│   ├──── model/
│   │  ├──── categoryModel.ts
│   │  └──── noteModel.ts
│   ├──── app.ts
│   ├──── constants.ts
│   ├──── database.ts
│   ├──── errors.ts
├── .env
├── .env.example
├── .gitignore            # Files excluded from GitHub
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## Validation Rules (Regex)

| Field                | Rule                                                     |
| -------------------- | -------------------------------------------------------- |
| Title                | 3–100 characters, letters/numbers/basic punctuation only |
| Content              | 5–1,000 characters, any characters allowed               |
| Category name        | 2-50 characters, required                                |
| Category description | Minimum 5 characters, required                           |

---

## Author

Built by Oluchukwu Anakor as part of a backend development learning program under Genesys Tech Hub.
