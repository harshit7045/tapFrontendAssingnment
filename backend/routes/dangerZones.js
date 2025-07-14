const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDangerZones, addDangerZone } = require('../controllers/dangerZonesController');

// router.use(auth);
router.get('/', getDangerZones);
router.post('/', addDangerZone);

module.exports = router; 