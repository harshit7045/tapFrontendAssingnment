const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { alertLocation } = require('../controllers/alertController');

router.use(auth);
router.post('/location', alertLocation);

module.exports = router; 