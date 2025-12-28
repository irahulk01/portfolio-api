# portfolio-api

A simple and clean backend API built with **Node.js, Express, and MongoDB** for powering a personal portfolio website.  
This API is designed to handle health checks, future portfolio data, analytics (like visit counts), and scalable backend features.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas or Local)
- Mongoose
- dotenv

---

## Project Purpose

`portfolio-api` serves as the backend for a portfolio application.  
It is intentionally kept minimal so it can be:

- easy to understand
- easy to deploy
- easy to extend (projects, blogs, visits, contact forms, etc.)

---

## Folder Structure

```text
portfolio-api/
├── server.js
├── package.json
├── .env
├── node_modules/
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd portfolio-api
```

---

### 2. Install dependencies

```bash
npm install
```

Required packages:
- express
- mongoose
- dotenv

---

### 3. Environment configuration

Create a `.env` file in the project root:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio
```

Notes:
- Do not wrap values in quotes
- Make sure the database name (`portfolio`) exists
- For MongoDB Atlas, allow IP access `0.0.0.0/0` during development

---

### 4. Run the server

```bash
node server.js
```

You should see:

```text
✅ MongoDB connected
🚀 Server running on http://localhost:5001
```

---

## Available Routes

### Root
```
GET /
```
Response:
```text
Hello from Simple Server
```

---

### Health Check
```
GET /health
```

Response example:
```json
{
  "mongoState": 1,
  "mongoStateText": "connected",
  "ping": "ok"
}
```

This endpoint is useful for:
- verifying MongoDB connection
- deployment health checks
- debugging environment issues

---

## MongoDB Setup

### Option 1: Local MongoDB

```text
mongodb://localhost:27017/portfolio
```

Make sure MongoDB is running locally.

---

### Option 2: MongoDB Atlas (Recommended)

1. Create a free cluster on MongoDB Atlas
2. Create a database user
3. Copy the SRV connection string
4. Add your IP or allow `0.0.0.0/0`
5. Paste the URI into `.env` as `MONGO_URI`

---

## Scripts (optional)

Add these to `package.json` if needed:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## Future Enhancements

- Portfolio projects API
- Visit counter
- Blog system
- Contact form handling
- Authentication (JWT)
- Rate limiting & security middleware

---

## License

This project is intended for personal and educational use.
