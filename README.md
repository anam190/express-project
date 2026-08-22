# User Management System

A full-stack User Management System built using React, Node.js, Express.js, and MongoDB.

## Features

- Add new users
- View all users
- Search users by name or email
- Edit user details
- Update users
- Delete users
- Email validation
- Duplicate email prevention
- MongoDB database integration
- Responsive user interface

## Technologies Used

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express.js
- Mongoose
- CORS
- dotenv

### Database
- MongoDB Atlas

## Project Structure

```text
express-project/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md