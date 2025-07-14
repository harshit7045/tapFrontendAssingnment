const DangerZone = require('../models/DangerZone');

exports.getDangerZones = async (req, res) => {
  try {
    const dangerZones = await DangerZone.find();
    res.json({ dangerZones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addDangerZone = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      typeof radius !== 'number' ||
      radius <= 0
    ) {
      return res.status(400).json({ message: 'latitude, longitude, and positive radius are required' });
    }
    const dangerZone = new DangerZone({ latitude, longitude, radius });
    await dangerZone.save();
    res.status(201).json({ dangerZone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 