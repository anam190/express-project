const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("dns");

// Ensure .env is loaded regardless of execution directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config(); // fallback to CWD .env

// Configure reliable DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Use default DNS if setting servers fails
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ MongoDB URI is undefined! Check your .env file for MONGODB_URI or MONGO_URI.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;