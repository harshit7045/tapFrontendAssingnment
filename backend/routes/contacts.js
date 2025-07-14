const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getContacts, addContact, removeContact } = require('../controllers/contactsController');

router.use(auth);
router.get('/', getContacts);
router.post('/', addContact);
router.delete('/', removeContact);

module.exports = router; 