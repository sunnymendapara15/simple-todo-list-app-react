# Simple Todo List App

This repository contains a minimal todo list experience that pairs a lightweight Express API with a Create React App client.

## Backend (Express API)

The backend maintains an in-memory todo list and exposes CRUD endpoints for listing, creating, toggling, and deleting todos.

### Quick start

1. `cd backend`
2. `npm install`
3. `npm run dev`

The server listens on port `4000` by default but can be configured with the `PORT` environment variable.

## Frontend (React)

The frontend uses Create React App with a single page that consumes the backend API.

### Quick start

1. `cd frontend`
2. `npm install`
3. `npm start`

By default, the client assumes the API is reachable at `http://localhost:4000`. Override it with `REACT_APP_API_URL` if necessary.

## Running both locally

1. Start the backend (`cd backend && npm run dev`).
2. In a second terminal, start the frontend (`cd frontend && npm start`).

## API endpoints

- `GET /todos` — returns the full todo list.
- `POST /todos` — add a todo with `{ text: "..." }`.
- `PUT /todos/:id/toggle` — flip the completion state.
- `DELETE /todos/:id` — remove a todo.
