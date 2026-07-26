const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db"); // Import the database connection

const app = express();

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;

// middleware
app.use(express.json());

// routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contacts", contactRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});