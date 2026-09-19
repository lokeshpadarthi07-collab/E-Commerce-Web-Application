const mongoose = require('mongoose');

let isConnected = false;
let useFallback = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('⚠️ No MONGODB_URI provided in environment. Initializing in-memory dev database fallback.');
    useFallback = true;
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    useFallback = false;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('ℹ️ Defaulting to high-performance in-memory mock database for development/testing.');
    useFallback = true;
    return false;
  }
};

const isFallbackMode = () => useFallback;

module.exports = { connectDB, isFallbackMode };
