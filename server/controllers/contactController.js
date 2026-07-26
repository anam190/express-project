const getContacts = (req, res) => {
    res.status(200).json({
        message: "Get All Contacts",
    });
};

const createContact = (req, res) => {
    console.log(req.body);

    res.status(201).json({
        message: "Create Contact",
         data: req.body
    });
};

module.exports = {
    getContacts,
    createContact,
};