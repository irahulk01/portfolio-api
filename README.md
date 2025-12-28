# Simple Server

A minimal Express server scaffold.

## Install

```bash
cd simple-server
npm install
```

## Run

```bash
# start normally
npm start

# or with nodemon for development
npm run dev
```

The server listens on the port defined in the `PORT` environment variable or `5000` by default.

MongoDB Setup
---------------

Local MongoDB:

1. Install MongoDB via Homebrew (recommended on macOS):

```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

2. Default local URI: `mongodb://localhost:27017/portfolio`

MongoDB Atlas (cloud):

1. Create a free cluster at https://www.mongodb.com/cloud/atlas and create a database user.
2. Obtain the connection string (choose the SRV format) and set `MONGODB_URI` accordingly.

Environment:

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `PORT`:

```bash
cp .env.example .env
# edit .env and set MONGODB_URI
```

2. Start the server:

```bash
npm start
```

The app (`server.js`) will use `process.env.MONGODB_URI` and will log connection status on startup.
