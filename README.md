# Collaborative Whiteboard Application

A real-time collaborative whiteboard application built with React, Node.js, and Socket.IO.

## Features

- Real-time drawing collaboration
- Multiple drawing tools (brush, line, rectangle, circle, arrow, text)
- User authentication
- Canvas sharing
- Save and load functionality

## Tech Stack

### Frontend
- React
- Socket.IO Client
- TailwindCSS
- Perfect Freehand
- RoughJS

### Backend
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT Authentication

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory with:
```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend Setup
```bash
cd Frontend
npm install
```

## Running the Application

### Start the Backend
```bash
cd Backend
npm run dev
```

### Start the Frontend
```bash
cd Frontend
npm run start
```
