// ...existing code...
const express = require("express");
const router = express.Router();

const {
    getContacts,
    createContact,
} = require("../controllers/contactController");

// ...existing code...
router.get('/', getContacts);
router.post('/', createContact);
// ...existing code...

module.exports = router;