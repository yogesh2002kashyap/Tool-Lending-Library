# Tool Lending Library

A full-stack MERN application for managing a community tool lending library.

## Overview

This project includes a React frontend and an Express/MongoDB backend for creating, viewing, editing, searching, and deleting tool records.

## Features

- Responsive internal dashboard
- CRUD operations for tools
- Local search by tool name, category, or borrower
- Client-side validation and accessible forms
- Loading, empty, and error states
- Production-ready API with validation and XSS sanitization

## Tech Stack

- React + Vite
- React Router
- Axios
- Express
- MongoDB Atlas
- Mongoose

## Folder Structure

- frontend/
- backend/
- postman/

## Environment Variables

### Frontend

- VITE_API_URL: deployed backend URL (for example, https://tool-lending-library.onrender.com/api)

### Backend

- PORT: server port
- MONGO_URI: MongoDB Atlas connection string
- NODE_ENV: environment name

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Deployment

- Frontend: Vercel
- Backend: Render

## Live URLs

- Frontend: https://tool-lending-library.vercel.app
- Backend: https://tool-lending-library.onrender.com

## API Overview

- GET /api/health
- GET /api/tools
- POST /api/tools
- PUT /api/tools/:id
- DELETE /api/tools/:id