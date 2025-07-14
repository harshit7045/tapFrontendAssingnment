const mongoose = require('mongoose');

const dangerZoneSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true }, // in meters
});

module.exports = mongoose.model('DangerZone', dangerZoneSchema); 