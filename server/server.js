console.log("THIS IS MY SERVER FILE");

const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// GET
app.get("/api/contacts", (req, res) => {
    res.status(200).json({
        message: "Get All Contacts"
    });
});

// POST
app.post("/api/contacts", (req, res) => {
    console.log(req.body);

    res.status(201).json({
        message: "Create Contact"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});