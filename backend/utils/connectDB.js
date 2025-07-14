const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const db_name = 'tap_fronted';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB URI:', process.env.MONGO_URI); // Debug log
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: db_name,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 