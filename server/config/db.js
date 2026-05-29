const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\x1b[32m[MongoDB Connected]\x1b[0m Host: ${conn.connection.host}, DB Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`\x1b[31m[MongoDB Connection Error]\x1b[0m ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
