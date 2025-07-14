const User = require('../models/User');
const nodemailer = require('nodemailer');

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dragonaticprince7045@gmail.com',
    pass: 'eeog bgsw fufs ewuz',
  },
});

exports.alertLocation = async (req, res) => {
  console.log('alert received');
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.emergencyContacts.length) return res.status(400).json({ message: 'No emergency contacts' });

    // Prepare email
    const mailOptions = {
      from: 'dragonaticprince7045@gmail.com',
      to: user.emergencyContacts.join(','),
      subject: 'Safety Alert: Last Known Location',
      html: `<p>Hi, this is an automated safety alert.<br/>The last known location of <b>${user.name}</b> was:<br/>Latitude: <b>${latitude}</b><br/>Longitude: <b>${longitude}</b></p>`
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.json({ message: 'Alert sent' });
  } catch (err) {
    console.error('Error sending alert email:', err);
    res.status(500).json({ message: err.message });
  }
}; 