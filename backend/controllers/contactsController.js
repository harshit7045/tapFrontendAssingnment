const User = require('../models/User');

exports.getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ contacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emergencyContacts.includes(email)) return res.status(409).json({ message: 'Contact already exists' });
    user.emergencyContacts.push(email);
    await user.save();
    res.json({ contacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeContact = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.emergencyContacts = user.emergencyContacts.filter(e => e !== email);
    await user.save();
    res.json({ contacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 